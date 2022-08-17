import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";
import { DraftCenterAnchor } from "./drafts";

function Drafts({time, image_size, margin, hoverscale, animate_time, once}) {
	const [isHovered, setHovered] = useState(false)
	const [canAnimate, setAnimate] = useState(false)
	const [canHover, setHover] = useState(false)
	const canHover5 = isHovered&&canHover
	const animate_duration = canAnimate?{delay:animate_time/2, duration: animate_time/2}:{delay: time/2,duration: time/2 }
	
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

	const draft5 = {
		showtransition: {
			hidden: { opacity: 0, x:-(image_size.width) },
			show: { opacity: 1, x:-(image_size.width), transition: {
				duration: time
			  } }
		},
		hover:{
			draft: {
				animate:{
					scale: canHover5? hoverscale:1
				},
				transtion:{
					duration: time
				}
			},
			display:{
				animate:{
					 x: canAnimate||canHover5? 0:image_size.width-26.5
				},
				transition:animate_duration
			},
		},
	}
	
	const text= {
		hidden: {opacity: 0,x:(image_size.width), y:-margin/2 },
		show: {opacity:1,x:(image_size.width), y:0, transition : {
			delay: animate_time+time*1.2,
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
				<DraftCenterAnchor draft={draft5} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} buttonmargin={image_size.buttonmargin} content={
						<>
							<Div absolute imgTag src={IMAGES.appDraft5.initial}></Div>
							<motion.div layout animate={draft5.hover.display.animate} transition={draft5.hover.display.transition}><Div absolute imgTag src={IMAGES.appDraft5.end}></Div></motion.div>
						</>
				}/>
				

				<motion.ul variants={text}>
				<Div absolute _translateX1over2 _translateY1over2>
					<Div flex flexCol w={350}>
						<Div fontBold fontSize32 textCenter> 투명한 커뮤니티 자금 관리 </Div>
						<Div textGray500 fontSize20 textCenter hFull>커뮤니티 지갑 사용 내역을<br></br>한눈에 확인하고 관리하세요</Div>
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




export default function CommunityWalletDraft({time, image_size, margin, hoverscale, animate_time, once}) {
  return (<Div>
	<Div selfCenter>
    <Drafts time={time} image_size={image_size} margin={margin} hoverscale={hoverscale} animate_time={animate_time} once={once} />
  	</Div></Div>);
}
