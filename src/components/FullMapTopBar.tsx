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
import { urls } from "src/modules/urls";
import { href } from "src/modules/routeHelper";
import { signInAction } from "src/store/reducers/modalReducer";
import { IMAGES } from "src/modules/images";

const FullMapTopBar = ({ mode, clx = {} }) => {
	const { locale } = useRouter();
	const dispatch = useDispatch();
	const { isLoggedIn, walletType, selectedAddress } = useSelector((state: RootState) => ({
		isLoggedIn: state.auth.isLoggedIn,
		walletType: state.auth.walletType,
		selectedAddress: state.auth.klaytnAddress,
	}));
	const isTablet = useIsTablet();
	const onClickLogin = () => {
		if (isLoggedIn && selectedAddress) return;
		dispatch(signInAction({ enabled: true }));
	};
	const logoSrc = mode == "dark" ? IMAGES.basicBearWhite : IMAGES.basicBearNoBg;
	const logoTextProps = mode == "dark" ? { textWhite: true } : { textPrimary: true };
	const textColorProp = mode == "dark" ? { textWhite: true, bgColor: "rgba(0, 0, 0, 0.8)" } : { textBlack: true };
	const loginButtonProps = mode == "dark" ? { bgWhite: true, textBlack: true } : { bgPrimary: true, textWhite: true };

	if (isTablet)
		return (
			<Div absolute top0 bdBlurXl wFull pt20 pb10 z100 {...textColorProp} {...clx}>
				<Row mxAuto flex justifyCenter pr20>
					<Col auto>
						<Row roundedLg px={20}>
							<Col auto px0>
								<Div imgTag src={logoSrc} h={30} w={30} style={{ objectFit: "cover" }} />
							</Col>
							<Col auto px0 pr8 flex itemsCenter {...logoTextProps}>
								<Div spanTag fontBold>
									Gomz
								</Div>
							</Col>
						</Row>
					</Col>
					<Col></Col>
					<Col auto px10></Col>
					<Col auto {...loginButtonProps} rounded3xl pt2 cursorPointer onClick={onClickLogin}>
						<Div spanTag fontLight fontMedium>
							{isLoggedIn && selectedAddress ? selectedAddress.substring(0, 5) + "..." : "Login"}
						</Div>
					</Col>
				</Row>
				<SignInModal />
				<KlipQRModal />
			</Div>
		);
	return (
		<Div absolute top0 bdBlurXl wFull pt10 pb10 z100 {...textColorProp}>
			<Row mxAuto flex justifyCenter px30>
				<Col auto cursorPointer>
					<Row roundedLg px={20} onClick={() => href(urls.home)}>
						<Col auto px0>
							<Div imgTag src={logoSrc} h={30} w={30} style={{ objectFit: "cover" }} />
						</Col>
						<Col auto px0 pr2 flex itemsCenter>
							<Div spanTag fontBold {...logoTextProps}>
								Gomz
							</Div>
						</Col>
						<Col auto px0 pr8 flex itemsCenter>
							<Div spanTag fontLight textBase {...logoTextProps}>
								Space
							</Div>
						</Col>
					</Row>
				</Col>
				<Col></Col>
				<Col auto rounded3xl pt2 cursorPointer {...loginButtonProps} onClick={onClickLogin}>
					<Div spanTag fontLight fontMedium>
						{isLoggedIn && selectedAddress ? selectedAddress.substring(0, 5) + "..." : "Login"}
					</Div>
				</Col>
			</Row>
			<SignInModal />
			<KlipQRModal />
		</Div>
	);
};

export default FullMapTopBar;
