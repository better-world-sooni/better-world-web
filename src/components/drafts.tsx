import Div from "src/components/Div";
import { motion } from "framer-motion";
import CommunityFeedDraft from "./communityfeeddraft";
import CommunityWalletDraft from "./communitywalletdraft";
import HolderVerificationDraft from "./holderverificationdraft";
import { Iphone, iphoneSize } from "./iphone";
import InboxDraft from "./inbox";

const time=0.5
const animate_time = time*3
const once=false
const mountmargin=100
const hoverscale=1.1
const iPhoneWidthPercent = 20
const textprops = {title:{
		fontBold:true, fontSize:"2.5vw", textCenter:true
	}, 
	content:{
		textGray500:true, fontSize:"1.8vw", textCenter:true
	}}
const margin = 20

export const iPhoneWidth = iPhoneWidthPercent
export const iPhoneHeight = iPhoneWidthPercent*2380/1180
export const iPhoneContentWidth = iPhoneWidthPercent*((1-iphoneSize.contentWidth)/2+iphoneSize.buttonmargin)*2
export const iPhoneContentHeight = iPhoneWidthPercent*(1-iphoneSize.contentHeight)*1180/2380
export const factorTovw=(v)=> `${v}vw`
export const factorToPercent=(v)=> `${v*100}%`


export default function Drafts({minW=0}) {
  const minWProps = minW!=0 ? {wFull:true} : {minW:minW}
  return (<Div flex flexCol {...minWProps}>
	<Div selfCenter wFull>
	<InboxDraft margin={margin} time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once}/>
    <CommunityFeedDraft margin={margin} time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once}/>
	<HolderVerificationDraft margin={margin} time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once}/>
	{/* <CommunityWalletDraft margin={margin} time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once}/> */}
  	</Div></Div>);
}

export function DraftCenterAnchor({draft, onMouseEnter, onMouseLeave, content}) {
	return (
		<Div absolute _translateY1over2 _translateX1over2 onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			{draft.showtransition ? <motion.li variants={draft.showtransition} style={{width:"100%", height:"100%"}}>
			<motion.div animate={draft.hover.draft.animate} transition={draft.hover.draft.transtion}>
			<Iphone relative w={factorTovw(iPhoneWidth)}>
				{content}
			</Iphone>
			</motion.div>
			</motion.li>
			:
			<motion.div animate={draft.hover.draft.animate} transition={draft.hover.draft.transtion}>
			<Iphone relative w={factorTovw(iPhoneWidth)}>
				{content}
			</Iphone>
			</motion.div>
			}
		</Div>
	)
}

