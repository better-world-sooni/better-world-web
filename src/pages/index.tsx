import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
import React, { useEffect } from 'react';
import AppDescriptions from "src/components/appcontentdescriptions";
import HeaderAnimated from "src/components/headeranimated";
import FooterAnimated from "src/components/footeranimated";

const appstorelink=""
const playstorylink=""

export default function Home({ currentUser, currentNft }) {
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div hScreen px80 flex itemsCenter justifyCenter>
				<HeaderAnimated time={0.5} once={true} appstorelink={appstorelink} playstorylink={playstorylink}/>
			</Div>
			<AppDescriptions/>
			<Div h={700} wFull flex itemsCenter justifyCenter relative>
				<FooterAnimated time={0.5} once={false} appstorelink={appstorelink} playstorylink={playstorylink}/>
				<Div absolute bottom0 left0>
					<Footer showLogo={false} />
				</Div>
			</Div>
		</>
	);
}
