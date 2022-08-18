import Div from "src/components/Div";
import { motion } from "framer-motion";
import CommunityFeedDraft from "./communityfeeddraft";
import CommunityWalletDraft from "./communitywalletdraft";
import HolderVerificationDraft from "./holderverificationdraft";
import { Iphone } from "./iphone";
import ContainerDimensions from "./containerdimensions";

const time=0.5

const iphone_size=(width)=>{
	const factor = width/1180
	return {width:1180*factor, height:2380*factor, contentmarginWidth:57*factor, contentmarginHeigth:55*factor, buttonmargin:9*factor, rounded:190*factor, contentWidth:1068*factor, contentHeight:2270*factor, factor:factor}
	}
const margin=100
const hoverscale=1.1
const animate_time = time*3
const once=false

export default function Drafts() {
	const {ref, width} = ContainerDimensions()
  const image_size=iphone_size(240)
// const image_size=iphone_size(120)
  return (<Div ref={ref} wFull flex flexCol>
	<Div selfCenter wFull>
    <CommunityFeedDraft time={time} image_size={image_size} margin={margin} hoverscale={1} animate_time={animate_time} once={once} width={width}/>
	<HolderVerificationDraft time={time} image_size={image_size} margin={margin} hoverscale={hoverscale} animate_time={animate_time} once={once} width={width}/>
	<CommunityWalletDraft time={time} image_size={image_size} margin={margin} hoverscale={hoverscale} animate_time={animate_time} once={once} width={width}/>
  	</Div></Div>);
}

export function DraftCenterAnchor({draft, onMouseEnter, onMouseLeave, iphone_w, iphone_h, content, contentmarginWidth, contentmarginHeight, buttonmargin}) {
	return (
		<motion.li variants={draft.showtransition}>
		<motion.div layout animate={draft.hover.draft.animate} transition={draft.hover.draft.transtion}>
		<Div absolute _translateY1over2 _translateX1over2 w={iphone_w-buttonmargin} h={iphone_h} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<Iphone iphone_w={iphone_w} iphone_h={iphone_h} contentmarginWidth={contentmarginWidth} contentmarginHeight={contentmarginHeight} buttonmargin={buttonmargin} content={
				content
			}/>
		</Div>
		</motion.div>
		</motion.li>
	)
}

