import Div from "src/components/Div";
import { motion } from "framer-motion";
import CommunityFeedDraft from "./communityfeeddraft";
import CommunityWalletDraft from "./communitywalletdraft";
import HolderVerificationDraft from "./holderverificationdraft";
import { Iphone } from "./iphone";


const time=0.5

const image_size={width:243, height:491, contentmarginWidth:13.25, contentmarginHeigth:11.5, buttonmargin:2}
const margin=100
const hoverscale=1.1
const animate_time = time*3
const once=false


export default function Drafts() {
  return (<Div flex flexCol>
	<Div selfCenter>
    <CommunityFeedDraft time={time} image_size={image_size} margin={margin} hoverscale={1} animate_time={animate_time} once={once} />
	<HolderVerificationDraft time={time} image_size={image_size} margin={margin} hoverscale={hoverscale} animate_time={animate_time} once={once} />
	<CommunityWalletDraft time={time} image_size={image_size} margin={margin} hoverscale={hoverscale} animate_time={animate_time} once={once} />
  	</Div></Div>);
}

export function DraftBottomAnchor({draft, onMouseEnter, onMouseLeave, iphone_w, iphone_h, content, contentmarginWidth, contentmarginHeight, buttonmargin}) {
	return (
		<motion.li variants={draft.showtransition}>
		<motion.li variants={draft.taketransition}>
		<motion.div layout animate={draft.hover.draft.animate} transition={draft.hover.draft.transtion}>
		<Div absolute _translateYFull _translateX1over2 w={iphone_w-buttonmargin} h={iphone_h} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<Iphone iphone_w={iphone_w} iphone_h={iphone_h} contentmarginWidth={contentmarginWidth} contentmarginHeight={contentmarginHeight} buttonmargin={buttonmargin} content={
				content
			}/>
		</Div>
		</motion.div>
		</motion.li>
		</motion.li>
	)
}

export function DraftCenterAnchor({draft, onMouseEnter, onMouseLeave, iphone_w, iphone_h, content, contentmarginWidth, contentmarginHeight, buttonmargin}) {
	return (
		<motion.li variants={draft.showtransition}>
		<motion.li variants={draft.taketransition}>
		<motion.div layout animate={draft.hover.draft.animate} transition={draft.hover.draft.transtion}>
		<Div absolute _translateY1over2 _translateX1over2 w={iphone_w-buttonmargin} h={iphone_h} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<Iphone iphone_w={iphone_w} iphone_h={iphone_h} contentmarginWidth={contentmarginWidth} contentmarginHeight={contentmarginHeight} buttonmargin={buttonmargin} content={
				content
			}/>
		</Div>
		</motion.div>
		</motion.li>
		</motion.li>
	)
}