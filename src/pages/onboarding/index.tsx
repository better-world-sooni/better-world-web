import Col from "src/components/Col";
import Div from "src/components/Div";
import Row from "src/components/Row";
import { elastic as Menu } from "react-burger-menu";
import { IMAGES } from "src/modules/images";
import TypeAnimation from "react-type-animation";
import { MenuIcon } from "@heroicons/react/outline";
import { COLORS } from "src/modules/constants";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import { PLATFORM, truncateKlaytnAddress } from "src/modules/constants";
import { apiHelper } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginAction, removeAccountAuthAction } from "src/store/reducers/authReducer";
import { modalsWording } from "src/wording/modals";




export default function Onboarding({currentUser, currentNft, jwt}) {

    const [activeStep, setActiveStep] = useState(0);

    const goNextStep = () => {
        setActiveStep((prevStep) => prevStep+1)
    }

	return (
		<>
			<Div px80 sticky top0 background bgWhite bgOpacity90>
				<Div maxW={1100} mxAuto>
					<Div flex itemsCenter py4 gapX={8}>
						<Div rounded10 p4>
							<Div h44 imgTag src={IMAGES.betterWorldBlueLogo}></Div>
						</Div>
						<Div fontBold>BetterWorld</Div>
						<Div flex1 />
						<Div px8 fontSize14>
							위비 온보딩
						</Div>
						<Div px8 fontSize14>
							앱 로그인 큐알 재발급
						</Div>
						<Div px8 fontSize14>
							앱 비밀번호 재설정
						</Div>
						<Div ml8 textWhite bgBlack rounded100 fontSize14 py8 px16>
							지갑 연결
						</Div>
					</Div>
				</Div>
			</Div>
			<Div hScreen px80>
				<Div maxW={1100} mxAuto>
                    <ProgressBar
                        percent={activeStep/2*100}
                        filledBackground="linear-gradient(to right, #92C0F6, #0049EA)"
                    >
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <Div h30 imgTag src={IMAGES.betterWorldBlueLogo} clx={`${accomplished ? "grayscale0" : "grayscale"}`}></Div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <Div h30 imgTag src={IMAGES.betterWorldBlueLogo} clx={`${accomplished ? "grayscale0" : "grayscale"}`}></Div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <Div w30 h30 imgTag src={IMAGES.betterWorldBlueLogo} clx={`${accomplished ? "grayscale0" : "grayscale"}`}></Div>
                            )}
                        </Step>
                    </ProgressBar>
                    <Div >
                        {
                            {
                                [0]: <ConnectWallet />,
                                [1]: <RegisterUser/>,
                                [2]: <ReadyForBetterWorld />,
                            }[activeStep]
                        }
                    </Div>
				</Div>
			</Div>
		</>
	);
}

function ConnectWallet() {
    const [error, setError] = useState(null);
    const { locale } = useRouter();
    const dispatch = useDispatch();
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
    return(
        <>
            <Div>
                {"지갑을 연동하세요"}
            </Div>
            <Div>
                <Div ml8 textWhite bgBlack rounded100 fontSize14 py8 px16 onClick={loginWithKaikas}>
						지갑 연결
				</Div>
            </Div>
        </>

    )
}

function RegisterUser() {
    return(
        <Div>
            {"Hii"}
        </Div>
    )
}

function ReadyForBetterWorld() {
    return(
        <Div>
            {"Hi"}
        </Div>
    )
}

