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
import EmptyBlock from "src/components/EmptyBlock";




export default function Onboarding({currentUser, currentNft, jwt}) {

    console.log(currentUser, currentNft, jwt)

    const [activeStep, setActiveStep] = useState(currentUser ? 1 : 0);
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
                            {currentUser ? `${truncateKlaytnAddress(currentUser.klaytn_account.address)}` : "지갑 연결"}
						</Div>
					</Div>
				</Div>
			</Div>
			<Div hScreen px80 pt30>
				<Div maxW={1100} mxAuto>
                    <ProgressBar
                        percent={activeStep/2*100}
                        filledBackground="linear-gradient(to right, #92C0F6, #0049EA)"
                    >
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <Div>
                                    <Div h30 imgTag src={IMAGES.betterWorldBlueLogo} clx={`${accomplished ? "grayscale0" : "grayscale"}`}></Div>
                                    <Div spanTag fontSize10>
                                        {"지갑연결"}
                                    </Div>
                                </Div>
                                
                            )}
                            
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <Div>
                                    <Div h30 imgTag src={IMAGES.betterWorldBlueLogo} clx={`${accomplished ? "grayscale0" : "grayscale"}`}></Div>
                                    <Div spanTag fontSize10>
                                        {"유저등록"}
                                    </Div>
                                </Div>
                            )}
                        </Step>
                        <Step transition="scale">
                            {({ accomplished }) => (
                                <Div>
                                    <Div h30 imgTag src={IMAGES.betterWorldBlueLogo} clx={`${accomplished ? "grayscale0" : "grayscale"}`}></Div>
                                    <Div spanTag fontSize10>
                                        {"준비완료"}
                                    </Div>
                                </Div>
                            )}
                        </Step>
                    </ProgressBar>
                    <Div py50 flex justifyCenter>
                        {
                            {
                                [0]: <ConnectWallet login={loginWithKaikas}/>,
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

function ConnectWallet({login}) {
    
    
    return(
        <Div flexCol>
            <Div py20 textCenter>
                {"지갑을 연동하세요"}
            </Div>
            <Div flex auto py20 justifyCenter>
                <Div ml8 textWhite bgBlack rounded100 fontSize14 py8 px16 cursorPointer onClick={login}>
						지갑 연결
				</Div>
            </Div>
            <Div imgTag src={IMAGES.connectExample} ></Div>
        </Div>

    )
}



function RegisterUser() {

    const [success, setSuccess] = useState<boolean>(false);
	const [putPasswordError, setPutPasswordError] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [passwordError, setPasswordError] = useState<boolean>(false);
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
	const [passwordConfirmationError, setPasswordConfirmationError] = useState<boolean>(false);

    const validatePassword = (password) => {
		return String(password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
	};
	const handleChangePassword = ({ target: { value } }) => {
		setPassword(value);
		const isValid = validatePassword(value);
		if (isValid && passwordError) {
			setPasswordError(false);
		} else if (!(isValid || passwordError)) {
			setPasswordError(true);
		}
	};
    const validatePasswordConfirmation = (confirmation) => {
		return password === confirmation;
	};
	const handleChangePasswordConfirmation = ({ target: { value } }) => {
		setPasswordConfirmation(value);
		const isValid = validatePasswordConfirmation(value);
		if (isValid && passwordConfirmationError) {
			setPasswordConfirmationError(false);
		} else if (!(isValid || passwordConfirmationError)) {
			setPasswordConfirmationError(true);
		}
	};
	const areValidInputs = !(passwordConfirmationError || passwordError || password === "" || passwordConfirmation === "");

    return(
        <Div w={400} mx20 px15 my30>
            <Div textCenter>
                <Div spanTag fontBold textXl>
                    Better World App 비밀번호 설정
                </Div>
            </Div>
            <Row my15 roundedMd flex itemsCenter>
                <Div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
                    <input
                        placeholder="비밀번호"
                        className={"px-5 w-full focus:outline-none focus:border-gray-400 bg-gray-200 rounded-lg"}
                        style={{ height: 40, boxShadow: "none", border: "none" }}
                        type="password"
                        onChange={handleChangePassword}
                    ></input>
                    <Div textDanger textXs spanTag>
                        {passwordError && "비밀 번호는 숫자, 특수문자, 대소문자 영문이 포함돼 있는 8글자 이상의 단어입니다."}
                    </Div>
                </Div>
                <EmptyBlock h={4} />
                <Div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호 확인</label>
                    <input
                        placeholder="비밀번호 확인"
                        style={{ height: 40, boxShadow: "none", border: "none" }}
                        type="password"
                        className={"px-5 w-full focus:outline-none focus:border-gray-400 bg-gray-200 rounded-lg"}
                        onChange={handleChangePasswordConfirmation}
                    ></input>
                    <Div textDanger textXs>
                        {passwordConfirmationError && "비밀번호와 확인이 일치하지 않습니다."}
                    </Div>
                </Div>
                <EmptyBlock h={20} />
                <ThreeStateButton state={success ? 2 : areValidInputs ? 1 : 0} />
                <Div textDanger textXs spanTag>
                    {putPasswordError && "비밀번호를 설정하지 못하였습니다."}
                </Div>
            </Row>
        </Div>
    )
}

function ThreeStateButton({ state }) {
	enum State {
		Disabled,
		Clickable,
		Success,
	}
	const propsFromState = (state) => {
		if (state == State.Disabled) {
			return { bgGray100: true, textGray400: true };
		}
		if (state == State.Clickable) {
			return { bgPrimary: true, textWhite: true };
		}
		if (state == State.Success) {
			return { bgSuccess: true, textWhite: true };
		}
		return {};
	};
	const textFromState = (state) => {
		if (state == State.Disabled) {
			return "확인";
		}
		if (state == State.Clickable) {
			return "확인";
		}
		if (state == State.Success) {
			return "완료";
		}
		return "";
	};
	return (
		<Div>
			<Div cursorPointer h40 {...propsFromState(state)} roundedLg flex justifyCenter itemsCenter onClick={state == State.Clickable}>
				<Div>{textFromState(state)}</Div>
			</Div>
		</Div>
	);
}


function ReadyForBetterWorld() {
    return(
        <Div>
            {"Hi"}
        </Div>
    )
}

