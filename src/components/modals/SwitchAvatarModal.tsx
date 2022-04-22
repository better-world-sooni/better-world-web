import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, SparklesIcon, XIcon } from "@heroicons/react/outline";
import Div from "../Div";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";
import Row from "../Row";
import Col from "../Col";
import { IMAGES } from "src/modules/images";
import { modalsWording } from "src/wording/modals";
import { HOME_URL, KAIKAS, KLIP, PLATFORM } from "src/modules/constants";
import { klipPrepareAuth, klipRequestQRUrl, klipResult } from "src/modules/klipApiHelper";
import { generateQR } from "src/modules/generateQR";
import RoundedButton from "../RoundedButton";
import { useRouter } from "next/router";
import { apiHelper, apiHelperWithToken } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { changeNftAction, loginAction } from "src/store/reducers/authReducer";
import { signInAction, switchAvatarModalAction } from "src/store/reducers/modalReducer";
import { urls } from "src/modules/urls";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Spinner from "../common/Spinner";

export default function SwitchAvatarModal() {
	const dispatch = useDispatch();
	const { locale } = useRouter();
	const { enabled, currentNft, currentUser } = useSelector((state: RootState) => ({
		...state.modal.switchAvatarModal,
	}));
	const [error, setError] = useState(null);
	const closeModal = () => {
		dispatch(switchAvatarModalAction({ enabled: false, currentNft: null, currentUser: null }));
		setError(<Div spanTag>{modalsWording.signIn.encourageKlip[locale]}</Div>);
	};
	const nonCurrentNfts =
		currentUser?.nfts.filter((nft) => nft.contract_address != currentNft.contract_address || nft.token_id != currentNft.token_id) || [];

	return (
		<Modal open={enabled} onClose={closeModal} bdClx={"bg-black/30"} clx={"bg-white"}>
			{currentNft && (
				<Div px15>
					<Row py10 flex itemsCenter borderB1>
						<Col />
						<Col auto>
							<Div spanTag textLg fontSemibold>
								Switch Avatar
							</Div>
						</Col>
						<Col flex justifyEnd>
							<Div h20 w20 textGray700 cursorPointer onClick={closeModal}>
								<XIcon />
							</Div>
						</Col>
					</Row>
					{currentNft && <AvatarAccount nft={currentNft} current onSuccess={closeModal} />}
					{nonCurrentNfts.map((nft, index) => {
						return <AvatarAccount key={index} nft={nft} onSuccess={closeModal} />;
					})}
					<Div w={500}></Div>
				</Div>
			)}
		</Modal>
	);
}

function AvatarAccount({ nft, current = false, onSuccess }) {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const patchAndGotoNft = async () => {
		setLoading(true);
		const res = await apiHelperWithToken(apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id), "PUT", {
			property: "main",
		});
		if (res.success) {
			const redirect = urls.nftProfile.contractAddressAndTokenId(nft.contract_address, nft.token_id);
			dispatch(changeNftAction({ contract_address: nft.contract_address, token_id: nft.token_id, redirect }));
			onSuccess();
		} else {
			alert("업데이트중 문제가 발생하였습니다.");
			location.reload();
		}
		setLoading(false);
	};
	return (
		<Row py10 flex itemsCenter cursorPointer onClick={patchAndGotoNft}>
			<Col auto>
				<Div imgTag src={nft.nft_metadatum.image_uri} w50 h50 rounded></Div>
			</Col>
			<Col auto>
				<Div>{nft.nft_metadatum.name || nft.nft_profile.name}</Div>
			</Col>
			<Col />
			<Col auto>
				{loading ? <Spinner clx={"h-20 w-20"} /> : current ? <CheckCircleIcon width={20} height={20} /> : <SparklesIcon width={20} height={20} />}
			</Col>
		</Row>
	);
}