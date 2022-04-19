import { GlobeAltIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import useIsTablet from "src/hooks/useIsTablet";
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
import { emailVerificationAction, signInAction } from "src/store/reducers/modalReducer";
import { truncateKlaytnAddress } from "src/modules/constants";

const HomeTopBar = ({ currentUser, currentNft }) => {
	const { locale } = useRouter();
	const dispatch = useDispatch();
	const isTablet = useIsTablet();
	const onClickLogin = () => {
		if (currentUser) {
			if (currentNft) {
				href(urls.nftProfile.contractAddressAndTokenId(currentNft.contract_address, currentNft.token_id));
				return;
			}
			href(urls.onboarding.klaytnAddress(currentUser.klaytn_account.address));
			return;
		}
		dispatch(signInAction({ enabled: true }));
	};

	return (
		<Div fixed bgWhite wFull z100 borderB1>
			<Row maxW={1100} mxAuto flex itemsCenter px30 py10>
				<Col auto px0 onClick={() => href(urls.home)}>
					<Div imgTag src={IMAGES.betterWorldBlueLogo} h={50} w={50} style={{ objectFit: "cover" }} />
				</Col>
				<Col textLg textPrimary auto>
					BetterWorld{" "}
					<Div spanTag fontSemibold textPrimary pl2>
						αlpha
					</Div>
				</Col>
				<Col></Col>
				<Col auto rounded3xl px20 pt5 cursorPointer border1 pb8 onClick={onClickLogin}>
					입장
				</Col>
			</Row>
			<SignInModal />
			<KlipQRModal />
		</Div>
	);
};

export default HomeTopBar;
