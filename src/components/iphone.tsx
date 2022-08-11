import { motion } from "framer-motion";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";

export function Iphone({iphone_w, iphone_h, content, contentmarginWidth, contentmarginHeight, buttonmargin}) {
	return (
	<Div w={iphone_w-buttonmargin*2} h={iphone_h} rounded45 shadow2xl>
		<Div relative w={iphone_w} h={iphone_h} right={buttonmargin}>
			<Div top={contentmarginHeight} left={contentmarginWidth} absolute w={iphone_w-contentmarginWidth*2} h={iphone_h-contentmarginHeight*2} rounded25 overflowHidden>
				{content}
			</Div>
			<Div absolute w={iphone_w} h={iphone_h} imgTag src={IMAGES.iphon13}></Div>
		</Div>
	</Div>
	)
}

export function IphoneBlackContent({iphone_w, iphone_h, contentmarginWidth, contentmarginHeight, animation}) {
	return (
		<motion.div layout animate={animation.animate} transition={animation.transition}><Div absolute w={iphone_w-contentmarginWidth*2} h={iphone_h-contentmarginHeight*2} bgBlack></Div></motion.div>
	)
}