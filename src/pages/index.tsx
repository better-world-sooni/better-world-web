import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
import React, { useState } from 'react';
import AppDescriptions from "src/components/appcontentdescriptions";
import HeaderAnimated from "src/components/headeranimated";
import FooterAnimated from "src/components/footereranimated";
import { href } from "src/modules/routeHelper";
import HeaderAnimatedMod from "src/components/headeranimatedmodi";
import useIsTablet from "src/hooks/useIsTablet";
import { IMAGES } from "src/modules/images";
import { motion } from "framer-motion";

export const appstorelink="https://apps.apple.com/kr/app/betterworld/id1629301689"
export const playstorelink="https://play.google.com/store/apps/details?id=com.betterworld"

export default function Home({ currentUser, currentNft }) {
	const appstore = () => {
		href(appstorelink);
	};
	const playstore = () => {
		href(playstorelink);
	};
	const isTablet = useIsTablet();
	const [canhref, sethref] = useState(false)
	const time =0.5
	const container = {
		hidden: {opacity:0},
		show: {
		  opacity:1,
		  transition: {
			duration: time,
		  }
		}
	}
	const bgAnimation = {
		hidden: {x:-50+30,y:30, scale:1.5},
		show: { x:0+30,y:30, scale:1, transition: {
			duration: time*2
		  } }
	}

	const contentAnimation = {
		hidden: {opacity:0, x:20+30, y:30, scale:1.5},
		show: {opacity:1, x:0+30, y:30, scale:1, transition: {
			delay: time*2,
			duration: time
		  } }
	}
	const logotextAnimation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			delay: time*2.5,
			duration: time
		  } }
	}
	const text1Animation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			delay: time*3,
			duration: time
		  } }
	}

	const text2Animation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			delay: time*4,
			duration: time
		  } }
	}

	const linkAnimation = {
		hidden: {opacity:0},
		show: {opacity:1, transition: {
			delay: time*4.5,
			duration: time,
			onComplete: () => sethref(true),
		  } }
	}

	const informAnimation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			delay: time*5,
			duration: time
		  } }
	}
	if (isTablet) return (
		<>
		<motion.div
		initial="hidden"
		whileInView="show"
		viewport={{ once: true, amount:0.1 }}
		onViewportLeave={()=>sethref(false)}
		>
		<motion.ul variants={container}>
		<Div wFull hScreen flex flexCol itemsCenter justifyCenter>
			<Div flex flexCol itemsCenter justifyCenter wFull hFull>
					<Div hFull wFull flex flexCol itemsCenter justifyCenter>
					<Div mt90 relative wFull h60 w60>
						<Div absolute _translateY1over2 _translateX1over2><motion.li variants={bgAnimation}><Div imgTag h60 src={IMAGES.bwLogo.bg}/></motion.li></Div>
						<Div absolute _translateY1over2 _translateX1over2><motion.li variants={contentAnimation}><Div imgTag h60 src={IMAGES.bwLogo.content}/></motion.li></Div>
					</Div>
					<motion.li variants={logotextAnimation}><Div mt5 imgTag h20 src={IMAGES.logoword.firstBlack}/></motion.li>
					</Div>
					
					<Div hFull wFull flex flexCol itemsCenter justifyCenter>
					<motion.li variants={text1Animation}><Div fontSize28 textCenter fontBold roundedFull whitespaceNowrap>
						애장하는 PFP의{" "}
						<Div spanTag style={{background: "-webkit-linear-gradient(-45deg, #AA37FF 30%, #4738FF 90%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",}}>특권과 혜택</Div>
						,
					</Div></motion.li>
					<motion.li variants={text2Animation}><Div fontSize28 textCenter mxAuto fontBold roundedFull mt5>
						<Div flex flexRow whitespaceNowrap itemsCenter justifyCenter>
						지금
						<Div mb2 ml10 mr3 selfCenter imgTag maxW={180} src={IMAGES.logoword.firstGradient}/>
						에서</Div>
					</Div>
					<Div fontSize28 textCenter mxAuto fontBold roundedFull mt5>
						간편하게 누려보세요.
					</Div></motion.li>
					<motion.li variants={linkAnimation}>
					<Div mt20 flex justifyCenter gapX={10}>
						{canhref ?<Div imgTag h35 src={IMAGES.downloadOnAppStore} cursorPointer onClick={appstore}/>:<Div imgTag h35 src={IMAGES.downloadOnAppStore}/>}
						{canhref ?<Div imgTag h35 src={IMAGES.downloadOnGooglePlay} cursorPointer onClick={playstore}/>:<Div imgTag h35 src={IMAGES.downloadOnGooglePlay}/>}
					</Div>
					</motion.li>
					</Div>
					<Div hFull wFull flex flexCol itemsCenter justifyCenter>
					<motion.li variants={informAnimation}><Div fontSize16 textGray800 textCenter mxAuto roundedFull mt10 mb150>
						회원가입은 PC를 이용해주세요.
					</Div></motion.li>
					</Div>
					
			</Div>
			<Div wFull h150 bgGray100 borderT1 flex flexCol itemsCenter justifyCenter textCenter fontSize1 textGray500>
				<Div>BetterWorld from{" "}
				<Div spanTag textGray700 aTag href={"https://soonilabs.com"}>
					SOONI Labs
				</Div>
				<br></br>© BetterWorld. ALL RIGHTS RESERVED</Div>
			</Div>
		</Div></motion.ul></motion.div>
		</>
	)
	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div wFull flex itemsCenter justifyCenter>
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
