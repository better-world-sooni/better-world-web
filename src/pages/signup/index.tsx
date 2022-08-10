import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { useRef } from "react";
import MainTopBar from "src/components/MainTopBar";
import { useLoginWithKaikas } from "src/modules/authHelper";
import Carousel from "re-carousel";
import { useDispatch } from "react-redux";
import { emailVerificationAction, loginQRModalAction } from "src/store/reducers/modalReducer";
import Footer from "src/components/Footer";
import { href } from "src/modules/routeHelper";
import { appstorelink, playstorelink } from "..";

export default function Onboarding({ currentUser, currentNft }) {
	const carouselRef = useRef(null);
	const prev = () => {
		carouselRef?.current?.prev();
	};
	const next = () => {
		carouselRef?.current?.next();
	};
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div hScreen zIndex={-1000}>
				<Carousel
					auto
					ref={carouselRef}
					frames={
						currentUser?.nfts?.length == 0
							? [<SorryNotHolder key={0} />]
							: [
									!currentUser && <InstallApp key={1} next={next} />,
									!currentUser && <ConnectWallet key={2} prev={prev} />,
									<LoginQrOrPassword next={next} key={3} />,
									<Congratulations prev={prev} key={4} />,
							  ].filter((item) => item)
					}
				></Carousel>
			</Div>
			<Footer />
		</>
	);
}

function SorryNotHolder() {
	return (
		<Div hFull px80 flex itemsCenter justifyCenter bgBlack auto bgWhite>
			<Div maxW={1100} mb100 rounded1000 py50 px100 bgWhite bgOpacity90>
				<Div fontSize56 textCenter maxW={800} mxAuto fontSemibold>
					아직 홀더가 아니신가요? 저희{" "}
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						디스코드
					</Div>
					에 들어와 보세요.
				</Div>
				<Div flex justifyCenter mt30>
					<Div textWhite bgBlack rounded100 fontSize24 py8 px32 cursorPointer>
						디스코드 입장
					</Div>
				</Div>
			</Div>
		</Div>
	);
}

function InstallApp({ next }) {
	const appstore = () => {
		href(appstorelink);
	};
	const playstore = () => {
		href(playstorelink);
	};
	return (
		<Div hFull px80 flex itemsCenter justifyCenter bgBlack auto bgWhite>
			<Div maxW={1100} mb100 rounded1000 py50 px100 bgWhite bgOpacity90>
				<Div fontSize56 textCenter maxW={800} mxAuto fontSemibold>
					베터월드 앱,{" "}
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						설치하셨나요?
					</Div>{" "}
				</Div>
				<Div flex justifyCenter mt30 gapX={20}>
					<Div imgTag h50 cursorPointer src={IMAGES.downloadOnAppStore} onClick={appstore}></Div>
					<Div imgTag h50 cursorPointer src={IMAGES.downloadOnGooglePlay} onClick={playstore}></Div>
				</Div>
			</Div>
			<Div flex justifyCenter mt50 absolute bottom={"20vh"}>
				<Div border1 rounded100 fontSize24 py8 px32 cursorPointer onClick={next}>
					다음
				</Div>
			</Div>
		</Div>
	);
}

function ConnectWallet({ prev }) {
	const loginWithKaikas = useLoginWithKaikas();
	return (
		<Div hFull px80 flex itemsCenter justifyCenter bgBlack auto bgWhite>
			<Div maxW={1100} mb100 rounded1000 py50 px100 bgWhite bgOpacity90>
				<Div fontSize56 textCenter maxW={800} mxAuto fontSemibold>
					지갑 연결을 하면,{" "}
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						홀더 인증
					</Div>
					을 해드려요.
				</Div>
				<Div flex justifyCenter mt30>
					<Div textWhite bgBlack rounded100 fontSize24 py8 px32 cursorPointer onClick={loginWithKaikas}>
						지갑 연결
					</Div>
				</Div>
			</Div>
			<Div flex justifyCenter mt50 absolute bottom={"20vh"} gapX={20}>
				<Div border1 rounded100 fontSize24 py8 px32 cursorPointer onClick={prev}>
					이전
				</Div>
			</Div>
		</Div>
	);
}

function LoginQrOrPassword({ next }) {
	const dispatch = useDispatch();
	const handleGetQR = () => {
		dispatch(
			loginQRModalAction({
				enabled: true,
			}),
		);
	};
	const handleSetPassword = () => {
		dispatch(
			emailVerificationAction({
				enabled: true,
			}),
		);
	};
	return (
		<Div hFull px80 flex itemsCenter justifyCenter bgBlack auto bgWhite>
			<Div maxW={1100} mb100 rounded1000 py50 px100 bgWhite bgOpacity90>
				<Div fontSize56 textCenter maxW={800} mxAuto fontSemibold>
					앱 로그인 방식을{" "}
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						선택
					</Div>
					해 주세요
				</Div>
				<Div flex justifyCenter mt30 gapX={20}>
					<Div textWhite bgBlack rounded100 fontSize24 py8 px32 cursorPointer onClick={handleGetQR}>
						임시 큐알 발급
					</Div>
					<Div textWhite bgBlack rounded100 fontSize24 py8 px32 cursorPointer onClick={handleSetPassword}>
						비밀번호 설정
					</Div>
				</Div>
			</Div>
			<Div flex justifyCenter mt50 absolute bottom={"20vh"}>
				<Div border1 rounded100 fontSize24 py8 px32 cursorPointer onClick={next}>
					다음
				</Div>
			</Div>
		</Div>
	);
}

function Congratulations({ prev }) {
	return (
		<Div hFull px80 flex itemsCenter justifyCenter bgBlack auto bgWhite>
			<Div maxW={1100} mb100 rounded1000 py50 px100 bgWhite bgOpacity90>
				<Div fontSize56 textCenter maxW={800} mxAuto fontSemibold>
					축하드립니다!{" "}
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						Web3 Identity
					</Div>
					의 의미와 가치를 커뮤니티와 함께 찾아가요.
				</Div>
			</Div>
			<Div flex justifyCenter mt50 absolute bottom={"20vh"} gapX={20}>
				<Div border1 rounded100 fontSize24 py8 px32 cursorPointer onClick={prev}>
					이전
				</Div>
			</Div>
		</Div>
	);
}
