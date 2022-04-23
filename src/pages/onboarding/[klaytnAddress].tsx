import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { IMAGES } from "src/modules/images";
import { truncateKlaytnAddress } from "src/modules/constants";
import { useEffect, useState } from "react";
import apis from "src/modules/apis";
import { apiHelperWithJwtFromContext, apiHelperWithToken } from "src/modules/apiHelper";
import { NextPageContext } from "next";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import OnboardingTopBar from "src/components/OnboardingTopBar";
import { useDispatch } from "react-redux";
import { changeNftAction } from "src/store/reducers/authReducer";

function Index({ profile, currentUser }) {
	return (
		<Div>
			<Helmet bodyAttributes={{ style: "background-color : white;" }} />
			<OnboardingTopBar />
			<EmptyBlock h={100} />
			<Div px30>
				<Div mxAuto maxW={1100} px30 text2xl textCenter fontSemibold>
					<Div spanTag textPrimary>
						BetterWorld
					</Div>
					에 오신 것을 환영합니다.
					<br />
					<Div spanTag textPrimary>
						αlpha
					</Div>
					에서는 곰즈들에게 생명을 불어 넣을 것입니다.
				</Div>
				<EmptyBlock h={30} />
				<Div textCenter maxW={800} px30 mxAuto textLg>
					새로운 로그인 시에 깨울 곰즈를 선택하세요.
				</Div>
				<EmptyBlock h={30} />
				<Div mxAuto maxW={1100}>
					<Nfts nfts={profile.nfts} />
				</Div>
			</Div>
		</Div>
	);
}

function Nfts({ nfts }) {
	const dispatch = useDispatch();
	const patchAndGotoNft = async (contract_address, token_id) => {
		const res = await apiHelperWithToken(apis.nft.contractAddressAndTokenId(contract_address, token_id), "PUT", {
			property: "main",
		});
		if (res.success) {
			const redirect = urls.nftProfile.contractAddressAndTokenId(contract_address, token_id);
			dispatch(changeNftAction({ contract_address, token_id, redirect }));
		} else {
			alert("업데이트중 문제가 발생하였습니다.");
			location.reload();
		}
	};

	if (nfts.length == 0) {
		return (
			<Div textCenter py30>
				NFT를 보유하고 계시지 않군요. 아바타를 하나 장만해 보세요!
			</Div>
		);
	}
	return (
		<Div mxAuto maxW={1100} flex justifyCenter>
			{nfts.map((nft, index) => {
				return (
					<Div key={index} style={{ flex: "0 0 calc(25% - 20px)" }} mx10 my10>
						<Div cursorPointer roundedXl overflowHidden border1 onClick={() => patchAndGotoNft(nft.contract_address, nft.token_id)}>
							<Div imgTag src={nft.nft_metadatum.image_uri}></Div>
							<Div py20 px20 fontWeight={500}>
								{nft.nft_metadatum.name}
							</Div>
						</Div>
					</Div>
				);
			})}
		</Div>
	);
}

Index.getInitialProps = async (context: NextPageContext) => {
	const { klaytnAddress } = context.query;
	const res = await apiHelperWithJwtFromContext(context, apis.profile.klaytnAddress(klaytnAddress), "GET");
	return {
		profile: res.user,
	};
};

export default Index;
