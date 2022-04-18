import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
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
import { apiHelper } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { loginAction } from "src/store/reducers/authReducer";
import { signInAction } from "src/store/reducers/modalReducer";

export default function SignInModal() {
	const dispatch = useDispatch();
	const { locale } = useRouter();
	const { signInEnabled } = useSelector((state: RootState) => ({
		signInEnabled: state.modal.signIn.enabled,
	}));
	const [qrCode, setQRCode] = useState({
		enabled: false,
		qrImage: null,
		requestKey: null,
	});
	const [error, setError] = useState(null);
	const closeModal = () => {
		dispatch(signInAction({enabled: false}));
		setError(<Div spanTag>{modalsWording.signIn.encourageKlip[locale]}</Div>);
		setQRCode({
			enabled: false,
			qrImage: null,
			requestKey: null,
		});
	};
	const onClickKlipQRDone = async () => {
		const klipAuthResult = await klipResult(qrCode.requestKey, locale);
		if (klipAuthResult.status == "prepared") {
			setError(<Div spanTag>{"You have not authorized yet."}</Div>);
		} else if (klipAuthResult.status == "canceled") {
			setError(<Div spanTag>{"You have cancelled login."}</Div>);
		} else if (klipAuthResult.status == "preparing") {
			setError(<Div spanTag>{"Preparing QR code."}</Div>);
		} else if (klipAuthResult.status == "completed") {
			dispatch(loginAction(klipAuthResult));
			closeModal();
		} else {
			setError(<Div spanTag>{"Error occurred while authorizing."}</Div>);
		}
		return;
	};
	const handleClickKlip = async () => {
		const authPrepareResponse = await klipPrepareAuth();
		const deeplinkUrl = await klipRequestQRUrl(authPrepareResponse.request_key);
		const qrImage = await generateQR(deeplinkUrl);
		setError(<Div spanTag>{modalsWording.klipQR.signIn.title[locale]}</Div>);
		setQRCode({
			enabled: true,
			qrImage: qrImage,
			requestKey: authPrepareResponse.request_key,
		});
	};
	const handleClickKaikas = async () => {
		// @ts-ignore
		if (typeof window !== "undefined" && typeof window.klaytn !== "undefined") {
			const klaytn = window["klaytn"];
			try {
				const res = await klaytn.enable();
				const selectedAddress = res[0];
				const caver = window["caver"];
				if (caver && selectedAddress) {
					const nonceResponse = await apiHelper(apis.auth.kaikas.nonce(), "POST", {
						address: selectedAddress,
						platform: PLATFORM,
						locale: locale,
					});
					if (nonceResponse.success) {
						const signature = await caver.klay.sign(nonceResponse.nonce, selectedAddress);
						const verificationResponse = await apiHelper(apis.auth.kaikas.verification(), "POST", {
							signature,
							address: selectedAddress,
							signup_uuid: typeof nonceResponse.signup == "undefined" ? null : nonceResponse.signup.uuid,
						});
						dispatch(loginAction(verificationResponse));
						closeModal();
					}
				}
			} catch (error) {
				setError(
					<Div spanTag textWarning>
						{modalsWording.signIn.userCancelledRequest[locale]}
					</Div>,
				);
			}
		} else {
			setError(
				<Div spanTag textDanger>
					{modalsWording.signIn.walletNotDetected.kaikas[locale]}
				</Div>,
			);
		}
	};

	return (
		<Modal open={signInEnabled} onClose={closeModal} bdClx={"bg-black/30"} clx={"bg-white"}>
			{qrCode.enabled ? (
				<Div mx20 px15 py30>
					<Div imgTag src={qrCode.qrImage} w300 h300 mxAuto></Div>
					<Div textCenter pb15 pt30>
						<Div spanTag fontLight>
							{error}
						</Div>
					</Div>
					<Div>
						<RoundedButton size={"large"} color="green" text="Done" onClick={onClickKlipQRDone} />
					</Div>
				</Div>
			) : (
				<Div mx20 px15>
					<Row my30 flex itemsCenter>
						<Col />
						<Col auto>
							<Div spanTag textLg fontSemibold>
								{modalsWording.signIn.title[locale]}
							</Div>
						</Col>
						<Col flex justifyEnd>
							<Div h20 w20 textGray700 cursorPointer onClick={closeModal}>
								<XIcon />
							</Div>
						</Col>
					</Row>
					<Row
						my15
						bgColor="#216FEA"
						onClick={handleClickKlip}
						roundedFull
						h56
						flex
						itemsCenter
						clx={"transition delay-50 hover:-translate-y-1 hover:scale-105 duration-150 "}
					>
						<Col />
						<Col auto px0>
							<Div>
								<Div imgTag src={IMAGES.KAKAO_KLIP_ICON}></Div>
							</Div>
						</Col>
						<Col auto pr0>
							<Div textCenter textWhite>
								<Div spanTag>{modalsWording.signIn.methods.klip[locale]}</Div>
							</Div>
						</Col>
						<Col />
					</Row>
					<Row
						my15
						bgColor="rgb(89, 82, 72)"
						onClick={handleClickKaikas}
						roundedFull
						h56
						flex
						itemsCenter
						clx={"transition delay-50 hover:-translate-y-1 hover:scale-105 duration-150 "}
					>
						<Col />
						<Col auto px0>
							<Div>
								<Div imgTag h24 w24 src={IMAGES.KAIKAS_ICON}></Div>
							</Div>
						</Col>
						<Col auto pr0>
							<Div textCenter textGray100>
								<Div spanTag>{modalsWording.signIn.methods.kaikas[locale]}</Div>
							</Div>
						</Col>
						<Col />
					</Row>
					<Div w={600}></Div>
					<Row roundedFull h56 flex itemsCenter my15 border1>
						<Col />
						<Col auto>
							<Div spanTag fontLight>
								{modalsWording.signIn.noWallet[locale]}
							</Div>
						</Col>
						<Col />
					</Row>
				</Div>
			)}
		</Modal>
	);
}
