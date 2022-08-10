import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";


export default function FooterAnimated({time, once, appstore, playstore}) {
	const [canhref, sethref] = useState(false)
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
		hidden: {x:-50+90, scale:1.5},
		show: { x:0+90, scale:1, transition: {
			duration: time*2
		  } }
	}

	const contentAnimation = {
		hidden: {opacity:0, x:20+90, scale:1.5},
		show: {opacity:1, x:0+90, scale:1, transition: {
			delay: time*2,
			duration: time
		  } }
	}

	const text1Animation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			delay: time*2.5,
			duration: time
		  } }
	}

	const text2Animation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			delay: time*3,
			duration: time
		  } }
	}

	const linkAnimation = {
		hidden: {opacity:0},
		show: {opacity:1, transition: {
			delay: time*3.5,
			duration: time,
			onComplete: () => sethref(true),
		  } }
	}

    return (
	<Div>
	<motion.div
	initial="hidden"
	whileInView="show"
	viewport={{ once: once, amount:0.5 }}
	onViewportLeave={()=>sethref(false)}
	>
	<motion.ul variants={container}>
	<Div flex flexRow>
		<Div selfCenter h180 w180 mr50>
			<Div>
			<EmptyBlock h={90}/>
				<Div relative>
					<Div absolute _translateY1over2 _translateX1over2><motion.li variants={bgAnimation}><Div imgTag src={IMAGES.bwLogo.bg}/></motion.li></Div>
					<Div absolute _translateY1over2 _translateX1over2><motion.li variants={contentAnimation}><Div imgTag src={IMAGES.bwLogo.content}/></motion.li></Div>
				</Div>
			</Div>
			<EmptyBlock h={90}/>
		</Div>
	<Div flexCol selfCenter itemsCenter>
		<motion.li variants={text1Animation}><Div imgTag h70 src={IMAGES.logoword.firstGradient}/></motion.li>
		<motion.li variants={text2Animation}><Div mt30 imgTag h={26} src={IMAGES.logoword.secondBlack}/></motion.li>
	</Div>
	</Div>
	<motion.li variants={linkAnimation}>
	<Div flex justifyCenter mt50 gapX={20}>
			{canhref ?<Div imgTag h50 src={IMAGES.downloadOnAppStore} cursorPointer onClick={appstore}/>:<Div imgTag h50 src={IMAGES.downloadOnAppStore}/>}
			{canhref ?<Div imgTag h50 src={IMAGES.downloadOnGooglePlay} cursorPointer onClick={playstore}/>:<Div imgTag h50 src={IMAGES.downloadOnGooglePlay}/>}
	</Div>
	</motion.li>
	</motion.ul>
	</motion.div>
	</Div>
    )
}

