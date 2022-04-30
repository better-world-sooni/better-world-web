import Div from "src/components/Div";
import SignInModal from "./modals/SignInModal";
import KlipQRModal from "./modals/KlipQRModal";
import EmailVerificationModal from "./modals/EmailVerificationModal";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";
import SwitchAvatarModal from "./modals/SwitchAccountModal";
import Helmet from "react-helmet";
import Confetti from "./modals/Confetti";
import PullToRefresh from "react-simple-pull-to-refresh";
import MainTopBar from "./MainTopBar";

function WebviewWrapper({ currentUser, currentNft, children, onRefresh = null, backable = false, pullable = true, messageable = false }) {
	return (
		<Div hScreen>
			<SwitchAvatarModal />
			<SignInModal />
			<EmailVerificationModal />
			<KlipQRModal />
			<Confetti />
			<Helmet bodyAttributes={{ style: "background-color : rgb(245, 245, 245);" }}>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
			</Helmet>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} backable={backable} messageable={messageable} />
			<EmptyBlock h={51} />
			{pullable ? (
				/* @ts-ignore */
				<PullToRefresh onRefresh={onRefresh} pullingContent={""} pullDownThreshold={100} maxPullDownDistance={120} style={{ height: "100%" }}>
					<Div hFull bgWhite>
						<Div mxAuto maxW={650} bgWhite>
							{children}
						</Div>
					</Div>
				</PullToRefresh>
			) : (
				<Div hFull bgWhite>
					<Div mxAuto maxW={650} bgWhite>
						{children}
					</Div>
				</Div>
			)}
		</Div>
	);
}

export default WebviewWrapper;
