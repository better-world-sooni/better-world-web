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

export default function Onboarding() {

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
    return(
        <Div>
            {"Hi"}
        </Div>
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

