import { GlobeAltIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import useIsTablet from "src/hooks/useIsTablet";
import { modalActions } from "src/store/reducers/modalReducer";
import { RootState } from "src/store/reducers/rootReducer";
import Link from "next/link";
import Col from "./Col";
import Div from "./Div";
import Row from "./Row";
import { useRouter } from "next/router";
import SignInModal from "./modals/SignInModal";
import KlipQRModal from "./modals/KlipQRModal";
import { moveTo } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import EmailVerificationModal from "./modals/EmailVerificationModal";
import { IMAGES } from "src/modules/images";

const HomeTopBar = ({ mode }) => {
	const { locale } = useRouter();
	const dispatch = useDispatch();
	const { isLoggedIn, user } = useSelector((state: RootState) => ({
		isLoggedIn: state.auth.isLoggedIn,
		user: state.auth.user,
	}));
	const isTablet = useIsTablet();
	const onClickLogin = () => {
		if (isLoggedIn) return;
		dispatch(modalActions.setSignInEnabled(true));
	};
	const onClickEmailVerification = () => {
		if (isLoggedIn) return;
		dispatch(modalActions.setEmailVerificationEnabled(true));
	};

	return (
		<Div fixed bgWhite wFull z100 borderB1>
			<Div bgPrimaryLight>
				<Row maxW={1100} mxAuto flex itemsCenter px30 py7>
					<Col />
					<Col auto textSm>
						NFT 홀더신가요? 혹은 컬렉션 운영자? 보유/운영중인{" "}
						<Div spanTag textPrimary>
							Klaytn NFT 컬렉션을 손쉽게 등록해서 벳지를 얻어봐요!
						</Div>
					</Col>
					<Col />
				</Row>
			</Div>
			<Row maxW={1100} mxAuto flex itemsCenter px30 py10>
				<Col auto px0 onClick={() => moveTo(urls.home)}>
					<Div imgTag src={IMAGES.betterWorldBlueLogo} h={50} w={50} style={{ objectFit: "cover" }} />
				</Col>
				<Col textLg textPrimary auto>
					BetterWorld{" "}
					<Div spanTag fontSemibold textPrimary auto pl2>
						αlpha
					</Div>
				</Col>
				<Col></Col>
				<Col auto rounded3xl px20 pt5 cursorPointer border1 pb8 onClick={onClickLogin} clx={"animate-bounce"}>
					입장
				</Col>
			</Row>
			<SignInModal />
			<EmailVerificationModal />
			<KlipQRModal />
		</Div>
	);
};

export default HomeTopBar;
