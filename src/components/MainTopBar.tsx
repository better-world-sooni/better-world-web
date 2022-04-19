import { GlobeAltIcon, SearchCircleIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import useIsTablet from "src/hooks/useIsTablet";
import { emailVerificationAction, signInAction } from "src/store/reducers/modalReducer";
import { RootState } from "src/store/reducers/rootReducer";
import Link from "next/link";
import Col from "./Col";
import Div from "./Div";
import Row from "./Row";
import { useRouter } from "next/router";
import SignInModal from "./modals/SignInModal";
import KlipQRModal from "./modals/KlipQRModal";
import { href } from "src/modules/routeHelper";
import { urls } from "src/modules/urls";
import EmailVerificationModal from "./modals/EmailVerificationModal";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";
import { truncateKlaytnAddress } from "src/modules/constants";

const MainTopBar = ({ user }) => {
	const { locale } = useRouter();
	const dispatch = useDispatch();
	const isTablet = useIsTablet();
	const onClickLogin = () => {
		dispatch(signInAction({ enabled: true }));
	};
	const onClickEmailVerification = () => {
		dispatch(emailVerificationAction({ enabled: true }));
	};
	const onClickProfile = () => {
		href(urls.profile.klaytnAddress(user.klaytn_account.address));
	}
	const onClickChat = () => {
		href(urls.chat);
	};

	return (
		<>
			<Div fixed bgWhite wFull borderB1 px30 z1>
				<Row maxW={1100} mxAuto flex itemsCenter py10 gapX={10}>
					<Col auto px0 onClick={() => href(urls.home)}>
						<Div imgTag src={IMAGES.betterWorldBlueLogo} h={50} w={50} style={{ objectFit: "cover" }} />
					</Col>
					<Col textLg textPrimary auto px0 onClick={() => href(urls.index)} cursorPointer>
						BetterWorld{" "}
						<Div spanTag fontSemibold textPrimary pl2>
							αlpha
						</Div>
					</Col>
					<Col></Col>
					<Col auto rounded3xl px20 pt5 cursorPointer border1 pb8 onClick={onClickLogin}>
						Feed
					</Col>
					<Col auto rounded3xl px20 pt5 cursorPointer border1 pb8 onClick={onClickLogin}>
						Capsules
					</Col>
					<Col auto rounded3xl px20 pt5 cursorPointer border1 pb8 onClick={onClickChat}>
						Chat
					</Col>
					{user ? (
						<Col auto rounded3xl px20 pt5 cursorPointer border1 pb8 onClick={onClickProfile}>
							{truncateKlaytnAddress(user.klaytn_account.address)}
						</Col>
					) : (
						<Col auto rounded3xl px20 pt5 cursorPointer border1 pb8 onClick={onClickLogin} clx={"animate-bounce"}>
							연결
						</Col>
					)}
				</Row>
				<SignInModal />
				<EmailVerificationModal />
				<KlipQRModal />
			</Div>
			<EmptyBlock h={80} />
		</>
	);
};

export default MainTopBar;
