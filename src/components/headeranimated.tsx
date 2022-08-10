import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";


export default function HeaderAnimated({time, once, appstore, playstore}) {
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

	const text1Animation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			duration: time
		  } }
	}

	const text2Animation = {
		hidden: {opacity:0, y:-20},
		show: {opacity:1, y:0, transition: {
			delay: time*1.5,
			duration: time
		  } }
	}

	const linkAnimation = {
		hidden: {opacity:0},
		show: {opacity:1, transition: {
			delay: time*2,
			duration: time,
			onComplete: () => sethref(true),
		  } }
	}

    return (
	<Div mb100>
		<motion.div
		initial="hidden"
		whileInView="show"
		viewport={{ once: once, amount:0.5 }}
		onViewportLeave={()=>sethref(false)}
		>
		<motion.ul variants={container}>
		<Div maxW={1100} mt100 mb100 py50 px100>
			<motion.li variants={text1Animation}><Div fontSize48 textCenter fontBold bgWhite roundedFull>
				애장하는 PFP의{" "}
				<Div spanTag style={{background: "-webkit-linear-gradient(45deg, #AA37FF 30%, #4738FF 90%)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",}}>특권과 혜택</Div>
				,
			</Div></motion.li>
			<motion.li variants={text2Animation}><Div fontSize48 textCenter mxAuto fontBold bgWhite roundedFull mt20>
				지금, BetterWorld에서 간편하게 누려보세요.
			</Div></motion.li>
			<motion.li variants={linkAnimation}>
			<Div flex justifyCenter mt80 gapX={20}>
			{canhref ?<Div imgTag h50 src={IMAGES.downloadOnAppStore} cursorPointer onClick={appstore}/>:<Div imgTag h50 src={IMAGES.downloadOnAppStore}/>}
			{canhref ?<Div imgTag h50 src={IMAGES.downloadOnGooglePlay} cursorPointer onClick={playstore}/>:<Div imgTag h50 src={IMAGES.downloadOnGooglePlay}/>}
			</Div>
			</motion.li>
		</Div>
		</motion.ul>
		</motion.div>
	</Div>
    )
}

