import Div from "src/components/Div";
import Helmet from "react-helmet";
import Confetti from "src/components/modals/Confetti";
import EmptyBlock from "src/components/EmptyBlock";
import MainTopBar from "src/components/MainTopBar";
import { IMAGES } from "src/modules/images";
import Row from "src/components/Row";
import Col from "src/components/Col";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import { useDispatch } from "react-redux";
import { emailVerificationAction, signInAction } from "src/store/reducers/modalReducer";
import { loginAction, removeAccountAuthAction } from "src/store/reducers/authReducer";
import SignInModal from "src/components/modals/SignInModal";
import { PLATFORM, truncateKlaytnAddress } from "src/modules/constants";
import { apiHelper } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { useState } from "react";
import { useRouter } from "next/router";
import { modalsWording } from "src/wording/modals";
import EmailVerificationModal from "src/components/modals/EmailVerificationModal";

export default function Home({ currentUser, currentNft }) {
	const [error, setError] = useState(null);
	const { locale } = useRouter();
	const dispatch = useDispatch();
	const onClickLogin = () => {
		if (currentUser) {
			dispatch(emailVerificationAction({ enabled: true }));
			return;
		}
		loginWithKaikas();
	};
	const onClickRemoveAccount = () => {
		dispatch(removeAccountAuthAction({}));
	};
	const loginWithKaikas = async () => {
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
						const mainNft = verificationResponse.user.main_nft;
						const loginParams = {
							jwt: verificationResponse.jwt,
						};
						dispatch(loginAction(loginParams));
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
		<Div flex flexCol itemsCenter justifyCenter hScreen>
			<Helmet bodyAttributes={{ style: "background-color : rgb(250, 250, 250);" }} />
			<EmailVerificationModal />
			<Div maxW={800} h={"80vh"} mxAuto flex flexRow justifyCenter>
				{/* <Div px30>
					<Div imgTag src={IMAGES.betterWorldFeedExample} h={"80vh"} roundedLg></Div>
				</Div> */}
				<Div flex flexCol justifyCenter maxW={380}>
					<Div flex1></Div>
					<Div bgWhite py40 px30 roundedLg>
						<Row itemsCenter flex>
							<Col auto cursorPointer>
								<Div imgTag src={IMAGES.betterWorldBlueLogo} w={80} style={{ objectFit: "cover" }} />
							</Col>
							<Col textPrimary textLeft cursorPointer textXl auto fontWeight={500}>
								BetterWorld{" "}
								<Div spanTag fontSemibold pl2 textBase>
									αlpha
								</Div>
								<Div textBase textCenter>
									NFT Identity들의 <Div spanTag>Social Network</Div>
								</Div>
							</Col>
						</Row>
						{currentNft ? (
							<>
								<Div py20>
									<Div roundedLg imgTag src={currentNft.nft_metadatum.image_uri} w={200} mxAuto></Div>
								</Div>
								<Div flex flexRow justifyCenter>
									<Div
										rounded3xl
										border1={!currentUser}
										bgPrimary={currentUser}
										textWhite={currentUser}
										px20
										py5
										onClick={onClickLogin}
										cursorPointer
									>
										{`${truncateKlaytnAddress(currentUser.klaytn_account.address)} 비밀번호 설정`}
									</Div>
								</Div>
								<Div flex flexRow justifyCenter mt10 textSm>
									<Div px20 py5 onClick={onClickRemoveAccount} cursorPointer>
										장치에서 계정 제거
									</Div>
								</Div>
							</>
						) : (
							<>
								<Div
									rounded3xl
									border1={!currentUser}
									bgPrimary={currentUser}
									textWhite={currentUser}
									px20
									py5
									onClick={onClickLogin}
									cursorPointer
									textCenter
									mt20
								>
									{currentUser ? `${truncateKlaytnAddress(currentUser.klaytn_account.address)} 비밀번호 설정` : "카이카스 유저 앱 비밀번호 설정"}
								</Div>
								{currentUser && (
									<Div flex flexRow justifyCenter mt10 textSm>
										<Div px20 py5 onClick={onClickRemoveAccount} cursorPointer>
											장치에서 계정 제거
										</Div>
									</Div>
								)}
							</>
						)}
					</Div>
					<Div mt20 textSm textCenter>
						앱을 다운로드하세요
					</Div>
					<Div flex flexRow mt10 gapX={10} px30>
						<Div flex1>
							<Div imgTag src={IMAGES.downloadOnAppStore}></Div>
						</Div>
						<Div flex1>
							<Div imgTag src={IMAGES.downloadOnGooglePlay}></Div>
						</Div>
					</Div>
					<Div flex1></Div>
				</Div>
			</Div>
		</Div>
	);
}
