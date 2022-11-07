import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { IphoneBlackContent } from "./iphone";
import { DraftCenterAnchor, factorTovw, iPhoneHeight } from "./drafts";

function Drafts({time, mountmargin, hoverscale, animate_time, once, textprops, margin}) {
	const [isHovered, setHovered] = useState(false)
	const [canAnimate, setAnimate] = useState(false)
	const [canHover, setHover] = useState(false)
	const canHover5 = isHovered&&canHover
	const modifed_animate_time = animate_time*4/3
	const animate_duration = canAnimate?{duration: modifed_animate_time/4}:{duration: time/2 }
	
	const container = {
		hidden: { opacity: 0,y : -mountmargin},
		show: {
		  opacity: 1,
		  y: 0,
		  transition: {
			duration: time,
			onUpdate: () => setHover(false),
			onComplete: () => setAnimate(true),
		  }
		}
	}

	const draft1 = {
		hover:{
			draft: {
				animate:{
					scale: canAnimate||canHover5? 1-(hoverscale-1)*1.5:1
				},
				transtion:canAnimate?{
					duration: modifed_animate_time/4
				}:{
					delay : time/2,
					duration: time/2
				}
			},
			display:{
				animate:{
					 y: canAnimate||canHover5? "0%":"100%"
				},
				transition:animate_duration
			},
		},
	}

	const draft2 = {
		hover:{
			draft: {
				animate:{
					scale: canAnimate||canHover5? hoverscale:1, opacity : canAnimate||canHover5? 1:0, y:canAnimate||canHover5? "-10%":"10%"
				},
				transtion:canAnimate?{
					duration: modifed_animate_time/4
				}:{
					delay : time/2,
					duration: time/2
				}
			},
			black: {
				animate:{opacity: canAnimate||canHover5? 0.5 : 0},
				transition:canAnimate?{
					delay : (modifed_animate_time/4)*1.5,
					duration: (modifed_animate_time/4)*0.5
				}:{
					delay : time*1.2,
					duration: time/2
				}
			},
			display: {
				animate:{
					y: canAnimate||canHover5? "0%":"100%"
				},
				transition:canAnimate?{
					delay : (modifed_animate_time/4)*1.5,
					duration: (modifed_animate_time/4)*0.5
				}:{
					delay : time*1.2,
					duration: time/2
				}
			},
		},
	}
	
	const text= {
		hidden: {opacity: 1 },
		show: {opacity:1, transition : {
			delay: modifed_animate_time,
			duration: time,
			onComplete: () => {setHover(true);setAnimate(false)},
		}}
	  }

  return (
	<Div wFull pt10>
    <motion.div
      initial="hidden"
      whileInView="show"
	  onViewportLeave={()=>{setAnimate(false);setHover(false);}}
      viewport={{ once: once, amount:0 }}
	  style={{marginTop: factorTovw(((iPhoneHeight/2)*hoverscale)+4), paddingBottom: factorTovw(((iPhoneHeight/2)*hoverscale)+4)}}
    >
	<motion.ul variants={container}>
		<Div flex justifyCenter itemsCenter wFull>
			<Div w={"50%"} flex flexRow justifyEnd itemsCenter>
			<Div relative right={factorTovw(margin)}>
					<motion.ul variants={text}>
					<Div absolute _translateX1over2 _translateY1over2>
						<Div flex flexCol>
							<Div whitespaceNowrap {...textprops.title}> 간편한 홀더 인증 </Div>
							<Div whitespaceNowrap {...textprops.content}>나만의 홀더 QR을 이용해 <br />오프라인에서 혜택을 누리고, <br />다른 커뮤니티원과 손쉽게 팔로우하세요.</Div>
						</Div>
					</Div></motion.ul>
				</Div>
			</Div>
			<Div w={"50%"} flex flexRow justifyStart itemsCenter>
				<Div relative left={factorTovw(margin)}>
					<DraftCenterAnchor draft={draft1} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} content={
							<>
								<Div absolute wFull hFull imgTag src={IMAGES.appDraft6.holder.end}></Div>
							</>
					}/>
					<DraftCenterAnchor draft={draft2} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} content={
							<>
								<Div absolute wFull hFull imgTag src={IMAGES.appDraft6.auth.initial}></Div>
								<IphoneBlackContent animation={draft2.hover.black} />
								<motion.div animate={draft2.hover.display.animate} transition={draft2.hover.display.transition} style={{position:'absolute', width:"100%", height:"100%"}}><Div wFull hFull imgTag src={IMAGES.appDraft6.auth.end}></Div></motion.div>
							</>
					}/>
				</Div>
			</Div>
		</Div>
	</motion.ul>
    </motion.div>
	</Div>
  );
}



export default function HolderVerificationDraft({time, textprops, mountmargin, hoverscale, animate_time, once, margin}) {
  return (<Div>
	<Div selfCenter>
    <Drafts time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once} margin={margin} />
  	</Div></Div>);
}
