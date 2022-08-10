import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
import React from 'react';
import AppDescriptions from "src/components/appcontentdescriptions";
import HeaderAnimated from "src/components/headeranimated";
import FooterAnimated from "src/components/footereranimated";
import { href } from "src/modules/routeHelper";
import HeaderAnimatedMod from "src/components/headeranimatedmodi";

export const appstorelink="https://apps.apple.com/kr/app/betterworld/id1629301689"
export const playstorelink="https://play.google.com/store/apps/details?id=com.betterworld"

export default function Home({ currentUser, currentNft }) {
	const appstore = () => {
		href(appstorelink);
	};
	const playstore = () => {
		href(playstorelink);
	};
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div wFull hScreen flex itemsCenter justifyCenter overflowHidden>
				{/* <HeaderAnimatedMod time={0.5} once={false} appstore={appstore} playstore={playstore}/> */}
				<HeaderAnimated time={0.5} once={false} appstore={appstore} playstore={playstore}/>
			</Div>
			<AppDescriptions/>
			<Div h={700} wFull flex itemsCenter justifyCenter relative>
				<FooterAnimated time={0.5} once={false} appstore={appstore} playstore={playstore}/>
				<Div absolute bottom0 left0>
					<Footer showLogo={false} />
				</Div>
			</Div>
		</>
	);
}
