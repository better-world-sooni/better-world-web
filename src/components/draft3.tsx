import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";
import { IphoneBlackContent } from "./iphone";
import { DraftCenterAnchor } from "./appcontentdescriptions";

function Drafts({time, image_size, margin, hoverscale, animate_time, once}) {
	const [isHovered, setHovered] = useState(false)
	const [canAnimate, setAnimate] = useState(false)
	const [canHover, setHover] = useState(false)
	const canHover5 = isHovered&&canHover
	const modifed_animate_time = animate_time*4/3
	const animate_duration = canAnimate?{duration: modifed_animate_time/4}:{duration: time/2 }
	
	const container = {
		hidden: { opacity: 0,y : -margin},
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

	const draft6 = {
		showtransition: {
			hidden: { opacity: 0, x:-(image_size.width) },
			show: { opacity: 1, x:-(image_size.width), transition: {
				duration: time
			  } }
		},
		hover:{
			draft: {
				animate:{
					scale: canAnimate||canHover5? 1-(hoverscale-1)*1.5:1
				},
				transtion:canAnimate?{
					delay : modifed_animate_time/4,
					duration: modifed_animate_time/4
				}:{
					delay : time/2,
					duration: time/2
				}
			},
			display:{
				animate:{
					 y: canAnimate||canHover5? 0:image_size.height-image_size.contentmarginHeigth*2
				},
				transition:animate_duration
			},
		},
	}

	const draft7 = {
		showtransition: {
			hidden: { opacity: 0, x:-(image_size.width) },
			show: { opacity: 1, x:-(image_size.width), transition: {
				duration: time
			  } }
		},
		hover:{
			draft: {
				animate:{
					scale: canAnimate||canHover5? hoverscale:1, opacity : canAnimate||canHover5? 1:0, y:canAnimate||canHover5? -image_size.height*0.1:image_size.height*0.1
				},
				transtion:canAnimate?{
					delay : modifed_animate_time/4,
					duration: modifed_animate_time/4
				}:{
					delay : time/2,
					duration: time/2
				}
			},
			black: {
				animate:{opacity: canAnimate||canHover5? 0.5 : 0},
				transition:canAnimate?{
					delay : (modifed_animate_time/4)*2.5,
					duration: (modifed_animate_time/4)*0.5
				}:{
					delay : time*1.2,
					duration: time/2
				}
			},
			display: {
				animate:{
					y: canAnimate||canHover5? 0:image_size.height-image_size.contentmarginHeigth*2
				},
				transition:canAnimate?{
					delay : (modifed_animate_time/4)*2.5,
					duration: (modifed_animate_time/4)*0.5
				}:{
					delay : time*1.2,
					duration: time/2
				}
			},
		},
	}
	
	const text= {
		hidden: {opacity: 0,x:(image_size.width), y:-margin/2 },
		show: {opacity:1,x:(image_size.width), y:0, transition : {
			delay: modifed_animate_time+time*1.2,
			duration: time,
			onComplete: () => {setHover(true);setAnimate(false)},
		}}
	  }

  return (
	<Div wFull pt10>
	<EmptyBlock h={(image_size.height/2)*hoverscale+margin}/>
    <motion.div
      initial="hidden"
      whileInView="show"
	  onViewportLeave={()=>setAnimate(false)}
      viewport={{ once: once, amount:"all" }}
    >
	<motion.ul variants={container}>
		<Div flex justifyCenter itemsCenter>
			<Div relative wFull>
				<DraftCenterAnchor draft={draft6} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} buttonmargin={image_size.buttonmargin} content={
						<>
							<Div absolute imgTag src={IMAGES.appDraft6.holder.end}></Div>

						</>
				}/>

				<DraftCenterAnchor draft={draft7} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} buttonmargin={image_size.buttonmargin} content={
						<>
							<Div absolute imgTag src={IMAGES.appDraft6.auth.initial}></Div>
							<IphoneBlackContent iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} animation={draft7.hover.black} />
							<motion.div layout animate={draft7.hover.display.animate} transition={draft7.hover.display.transition}><Div absolute imgTag src={IMAGES.appDraft6.auth.end}></Div></motion.div>
						</>
				}/>

				<motion.ul variants={text}>
				<Div absolute _translateX1over2 _translateY1over2>
					<Div flex flexCol w={200}>
						<Div fontBold fontSize32 textCenter> 홀더 인증 </Div>
						<Div textGray500 fontSize20 textCenter hFull>오프라인 홀더 미팅 및 혜택 인증을 위한 큐알</Div>
					</Div>
				</Div></motion.ul>
			</Div>
			{/*  */}
		</Div>
	</motion.ul>
	<EmptyBlock h={(image_size.height/2)*hoverscale+margin}/>
    </motion.div>
	</Div>
  );
}



export default function Content3({time, image_size, margin, hoverscale, animate_time, once}) {
  return (<Div>
	<Div selfCenter>
    <Drafts time={time} image_size={image_size} margin={margin} hoverscale={hoverscale} animate_time={animate_time} once={once} />
  	</Div></Div>);
}
