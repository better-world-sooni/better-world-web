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
import useIsTablet from "src/hooks/useIsTablet";

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

	const isTablet = useIsTablet();
	if (isTablet) {
		return (
			<Div
				hScreen
				relative>
				<Div flex justifyCenter>
					<Div mt100 w50 imgTag src={IMAGES.betterWorldBlueLogo}></Div>
				</Div>
				<Div flex justifyCenter fontSize26>
					<Div textPrimary uniSans>BetterWorld</Div>
					<Div textPrimary fontBold ml10>αlpha</Div>
				</Div>
				<Div flexCol my77 fontSize32>
					<Div fontBold textCenter>No More Minting,<br></br>No More Paying.<br></br>Just Be Your</Div>
					<Div fontBold textCenter textPrimary>Web 3.0 Identity.</Div>
				</Div>
				<Div flex justifyCenter>
					<Div flexCol fontSize14>
						<Div flex w210 h50 fontSemibold justifyCenter itemsCenter roundedFull
						border={!currentUser}
						bgPrimary={!currentUser}
						textWhite={!currentUser}
						onClick={onClickLogin}
						clx={"hover:opacity-50"}
						cursorPointer>
						{currentUser ? `${truncateKlaytnAddress(currentUser.klaytn_account.address)} 비밀번호 설정` : "지갑 연결하기"}
						</Div>
						<Div flex w210 h50 fontSemibold justifyCenter itemsCenter border1 borderPrimary textPrimary roundedFull mt10>앱 다운로드하기</Div>
					</Div>
				</Div>
				<Div wFull py40 absolute bottom0 style={{background: "#F8F8F8",}}>
					<Div flex justifyCenter fontSize13>
						<Div fontLight textGray600>서비스 소개</Div>
						<Div mx8 fontLight textGray600>l</Div>
						<Div fontLight textGray600>이용 약관</Div>
						<Div mx8 fontLight textGray600>l</Div>
						<Div fontLight textGray600>개인 정보 처리 방침</Div>
					</Div>
					<Div notoSans fontLight fontSize11 textCenter textGray600>Ⓒ 2022 BetterWorld from SOONI Labs</Div>
				</Div>
			</Div>
		);
	}

	return (
		<Div
			style={{
				background: "linear-gradient(180deg, #FFFFFF 0%, #DEF7FF 100%);",
				}}
				hScreen
				relative
		>
			<EmailVerificationModal/>
				<>
					<Div absolute w220 top20 left50 imgTag src={IMAGES.betterWorldFullLogo}></Div>
					<Div
						absolute
						px30
						py3
						top20
						right50
						fontBold
						fontSize16
						textCenter
						leadingLoose
						roundedFull
						border={!currentUser}
						bgPrimary={!currentUser}
						textWhite={!currentUser}
						onClick={onClickLogin}
						clx={"hover:opacity-50"}
						cursorPointer>
						{currentUser ? `${truncateKlaytnAddress(currentUser.klaytn_account.address)} 비밀번호 설정` : "지갑 연결하기"}
					</Div>
				</>
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

								{currentUser && (
									<Div flex flexRow justifyCenter mt10 textSm>
										<Div px20 py5 onClick={onClickRemoveAccount} cursorPointer>
											장치에서 계정 제거
										</Div>
									</Div>
								)}
							</>
						)}
					<Div wFull h75 borderB1 borderGrey600></Div>
					<Div flex>
						<Div flexCol py50 pl140>
							<Div w90 mb10 imgTag src={IMAGES.betterWorldBlueShadowLogo}></Div>
							<Div fontBold fontSize66 leadingTight>NO MORE MINTING,<br></br>NO MORE PAYING.<br></br>JUST BE YOUR</Div>
							<Div fontBold textPrimary fontSize66 leadingTight>WEB 3.0 IDENTITY.</Div>
							<Div flex w150 hAuto mt40 cursorPointer>
								<Div imgTag src={IMAGES.downloadOnAppStore}></Div>
								<Div ml20 imgTag src={IMAGES.downloadOnGooglePlay}></Div>
							</Div>
						</Div>
						<Div absolute right140 h550 wAuto my50 ml250 imgTag src={IMAGES.appView}></Div>
					</Div>
		</Div>
	);
}