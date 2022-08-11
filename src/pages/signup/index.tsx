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
import { FaDiscord } from "react-icons/fa";
import { KeyIcon, QrcodeIcon } from "@heroicons/react/solid";

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
									currentUser && <LoginQrOrPassword next={next} key={3} />,
									currentUser && <Congratulations prev={prev} key={4} />,
							  ].filter((item) => item)
					}
				></Carousel>
			</Div>
			<Footer />
		</>
	);
}

function SorryNotHolder() {
	const gotodiscord = () => href("https://discord.gg/57VnP3pT5Z")
	return (
		<Div hFull px80 flex itemsCenter justifyCenter bgBlack auto bgWhite>
			<Div maxW={1100} mb100 rounded1000 py50 px100 bgWhite bgOpacity90>
				<Div fontSize52 textCenter maxW={800} mxAuto fontSemibold>
					아직 홀더가 아니신가요?<br></br>
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						WeBe 디스코드
					</Div>
					에서<br></br>민팅 일정을 확인해주세요.
				</Div>
				<Div flex justifyCenter mt30>
					<Div textWhite bgBlack rounded100 fontSize24 py8 px32 cursorPointer onClick={gotodiscord} flex flexRow gapX={10} itemsCenter fontBold>
						<Div mb5><FaDiscord size={30}/></Div>
						<Div mr5>디스코드 입장</Div>
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
					BetterWorld 앱,{" "}
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
				<Div fontSize52 textCenter maxW={800} mxAuto fontSemibold>
					지갑을 연결하면<br></br>
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						홀더 인증
					</Div>
					을 해드립니다.
				</Div>
				<Div flex justifyCenter mt30>
				<Div textWhite bgBlack rounded100 fontSize24 py8 px32 cursorPointer onClick={loginWithKaikas} flex flexRow gapX={10} itemsCenter fontBold>
						<Div mb2 h={32} imgTag src={IMAGES.kaikas}></Div>
						<Div mr8>지갑 연결</Div>
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
				<Div fontSize52 textCenter maxW={800} mxAuto fontSemibold>
					선호하는{" "}
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						로그인 방식
					</Div>
					을 선택해주세요
				</Div>
				<Div flex justifyCenter mt30 gapX={20}>
					
					<Div textWhite bgBlack rounded100 py8 px32 cursorPointer onClick={handleGetQR} flex flexRow itemsCenter gapX={10}>
					<Div mb3><QrcodeIcon width={24} height={24}/></Div>
					<Div spanTag fontSize20 mr5>로그인용 QR 발급</Div>
					</Div>
					<Div textWhite bgBlack rounded100 py8 px32 cursorPointer onClick={handleSetPassword} flex flexRow itemsCenter gapX={10}>
					<Div mb3><KeyIcon width={24} height={24}/></Div>
					<Div spanTag fontSize20 mr5>비밀번호 설정</Div>
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
					축하합니다!<br></br>
					<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>
						BetterWorld
					</Div>
					에서 NFT 홀더로서의 혜택을 마음껏 누리세요.
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
