import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { truncateKlaytnAddress } from "src/modules/constants";
import MainTopBar from "src/components/MainTopBar";
import { useState } from "react";
import { sha3_256 } from "js-sha3";
import apis from "src/modules/apis";
import { apiHelperWithToken } from "src/modules/apiHelper";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import NftCollectionProfile from "src/components/common/NftCollectionProfile";

export default function Home({ user }) {
	const [contract, setContract] = useState("");
	const [error, setError] = useState({
		value: false,
		text: "",
	});
	const [isValidAddress, setIsValidAddress] = useState(false);
	const [nftCollection, setNftCollection] = useState(null);
	const isAddress = (address) => {
		if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
			// check if it has the basic requirements of an address
			return false;
		} else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
			// If it's all small caps or all all caps, return true
			return true;
		} else {
			// Otherwise check each case
			return isChecksumAddress(address);
		}
	};
	const isChecksumAddress = (address) => {
		// Check each case
		address = address.replace("0x", "");
		var addressHash = sha3_256(address.toLowerCase());
		for (var i = 0; i < 40; i++) {
			// the nth letter should be uppercase if the nth digit of casemap is 1
			if (
				(parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
				(parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
			) {
				return false;
			}
		}
		return true;
	};
	const handleContractChange = ({ target: { value } }) => {
		setError({
			value: false,
			text: "",
		});
		setContract(value);
		setIsValidAddress(isAddress(value));
	};
	const handleClickAdd = async () => {
		if (nftCollection || error.value || !isValidAddress) {
			return;
		}
		try {
			const res = await apiHelperWithToken(apis.nft_collection.contractAddress(contract), "POST");
			console.log(res);
			if (!res.success) {
				switch (res.error_code) {
					case 0:
						setError({
							value: true,
							text: "주소가 유효하지 않습니다.",
						});
						return;
					case 1:
						setError({
							value: true,
							text: "컬렉션이 이미 존재합니다.",
						});
						return;
					case 2:
						setError({
							value: true,
							text: "주소가 스마트 계약이 아니거나 테스넷에 배포 돼 있을 수 있습니다.",
						});
						return;
					case 3:
						setError({
							value: true,
							text: "컬렉션의 홀더여야 추가가 가능합니다.",
						});
						return;
					default:
						throw new Error();
				}
			}
			setNftCollection(res.nft_collection);
			setError({
				value: false,
				text: "",
			});
		} catch {
			setError({
				value: true,
				text: "스마트 계약이 잘 구현 돼 있지 않습니다.",
			});
		}
	};
	const handleClickReset = () => {
		setContract("");
		setIsValidAddress(false);
		setNftCollection(null);
		setError({
			value: false,
			text: "",
		});
	};
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<MainTopBar user={user} />
			<Confetti />
			<EmptyBlock h={40} />
			<Div px30>
				<Div flex flexRow mxAuto maxW={1100}>
					<Div style={{ flex: 7 }}>
						<Div spanTag textXl fontWeight={500}>
							BetterWorld에 입주할 컬렉션 추가하기
						</Div>
						<EmptyBlock h={30} />
						<Div roundedXl py30 px30 border1>
							<Div spanTag>NFT 컬렉션의 홀더라면 컬렉션 스마트 계약이 다음 조건들을 만족할시에 추가 가능합니다.</Div>
							<Div liTag pt20 pb10>
								클레이튼 NFT
							</Div>
							<Div liTag py10>
								KIP17Enumerable 혹은 ERC721Enumerable Extension 구현
							</Div>
							<Div liTag py10>
								전체 공급량이 65535개 이하
							</Div>
							<input
								onChange={handleContractChange}
								placeholder="계약주소 예) 0xe5e47d1540d136777c0b4e0865f467987c3d6513"
								className={"rounded-full border-1 px-20 w-full focus:outline-none focus:border-gray-400 mt-20"}
								style={{ height: 50 }}
							></input>
							{error.value && (
								<Div pt10 textDanger>
									{error.text}
								</Div>
							)}
							<Div
								roundedFull
								h50
								mt20
								bgPrimary={isValidAddress}
								bgGray100={!isValidAddress}
								textWhite={isValidAddress}
								textGray400={!isValidAddress}
								bgSuccess={nftCollection}
								flex
								itemsCenter
								justifyCenter
								cursorPointer
								onClick={handleClickAdd}
							>
								<Div spanTag>{nftCollection ? "완료" : "추가"}</Div>
							</Div>
							{nftCollection && (
								<Div mt20 roundedFull h50 border1 flex itemsCenter justifyCenter cursorPointer onClick={handleClickReset}>
									<Div spanTag>리셋하기</Div>
								</Div>
							)}
							{nftCollection && (
								<Div>
									<EmptyBlock h={30} />
									<Div hrTag></Div>
									<EmptyBlock h={30} />
									<Div textCenter px20>
										축하드립니다! 컬렉션이 성공적으로 추가되었습니다. 컬렉션을 클릭해서 둘러보세요.
									</Div>
									<EmptyBlock h={30} />
									<NftCollectionProfile {...nftCollection} />
								</Div>
							)}
						</Div>
					</Div>
					<Div style={{ flex: 3 }}></Div>
				</Div>
				<EmptyBlock h={200} />
			</Div>
		</Div>
	);
}
