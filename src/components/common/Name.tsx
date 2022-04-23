import { CheckCircleIcon, PencilIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { COLORS } from "src/modules/constants";
import Div from "../Div";
import Spinner from "./Spinner";

enum NameState {
	Stale,
	Editting,
	Loading,
}

export default function Name({ nftName, nftMetadatumName, mine, contractAddress = "" }) {
	const initialName = nftName || nftMetadatumName;
	const [name, setName] = useState({
		value: initialName,
		edittingValue: initialName,
		state: NameState.Stale,
		error: "",
	});
	const isValidName = name.error == "" && name.edittingValue != "";
	const handleClickEditName = () => {
		setName({ ...name, state: NameState.Editting });
	};
	const handleEditName = ({ target: { value } }) => {
		const error = getNameError(value);
		setName({ ...name, edittingValue: value, error });
	};
	const handleClickSaveName = async () => {
		if (isValidName) {
			setName({ ...name, state: NameState.Loading });
			try {
				const endpoint = contractAddress ? apis.nft_collection.contractAddress._(contractAddress) : apis.nft._();
				const res = await apiHelperWithToken(endpoint, "PUT", {
					property: "name",
					value: name.edittingValue,
				});
				if (res.success) {
					setName({
						value: name.edittingValue,
						edittingValue: name.edittingValue,
						state: NameState.Stale,
						error: "",
					});
					return;
				}
				throw new Error();
			} catch {
				setName({ ...name, error: "입력하신 이름으로 업데이트 하지 못하였습니다." });
			}
		}
	};
	const getNameError = (value) => {
		if (value == "") {
			return "이름은 한 글자 이상이어야 합니다.";
		}
		if (value.split(" ").length > 5) {
			return "이름은 다섯 단어 이하여야 합니다.";
		}
		if (value.length > 20) {
			return "이름은 길이는 스무 글자 이하여야 합니다.";
		}
		return "";
	};

	useEffect(() => {
		setName({
			value: initialName,
			edittingValue: initialName,
			state: NameState.Stale,
			error: "",
		});
	}, [initialName]);

	return (
		<Div>
			{name.state == NameState.Editting && (
				<Div textDanger textXs fontNormal>
					{name.error}
				</Div>
			)}
			<Div itemsCenter flex flexRow>
				<Div flex1={name.state != NameState.Stale}>
					{
						{
							[NameState.Stale]: (
								<Div fontWeight={500} textXl>
									{name.value}
								</Div>
							),
							[NameState.Editting]: (
								<Div fontWeight={500} textXl>
									<input
										placeholder={name.value}
										value={name.edittingValue}
										className={"px-5 w-full focus:outline-none focus:border-gray-400 bg-gray-200 rounded-lg"}
										style={{ height: 40 }}
										onChange={handleEditName}
									></input>
								</Div>
							),
							[NameState.Loading]: <Div fontWeight={500}>{name.value}</Div>,
						}[name.state]
					}
				</Div>
				{mine && (
					<Div pl5>
						{
							{
								[NameState.Stale]: (
									<Div cursorPointer onClick={handleClickEditName}>
										<PencilIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[NameState.Editting]: (
									<Div cursorPointer textGray200={!isValidName} onClick={handleClickSaveName}>
										<CheckCircleIcon height={20} width={20} scale={1} strokeWidth={0.5} />
									</Div>
								),
								[NameState.Loading]: <Spinner clx={"h-20 w-20"} fill={COLORS.PRIMARY} circleFill={COLORS.GRAY200} />,
							}[name.state]
						}
					</Div>
				)}
			</Div>
		</Div>
	);
}
