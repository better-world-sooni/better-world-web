import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import EmptyBlock from "./EmptyBlock";
import { IphoneBlackContent } from "./iphone";
import { DraftCenterAnchor } from "./drafts";


function Drafts({time, image_size, margin, hoverscale, animate_time, once}) {
	const [isHovered1, setHovered1] = useState(false)
	const [isHovered2, setHovered2] = useState(false)
	const [isHovered3, setHovered3] = useState(false)
	const [isHovered4, setHovered4] = useState(false)
	const [canAnimate, setAnimate] = useState(false)
	const [canHover, setHover] = useState(false)
	const [fold, setFold] = useState(false)
	const canHover1 = isHovered1&&canHover
	const canHover2 = isHovered2&&canHover
	const canHover3 = isHovered3&&canHover
	const canHover4 = isHovered4&&canHover
	const animate_duration = canAnimate?{delay:animate_time/2, duration: animate_time/2, onComplete: () => setFold(true)}:{delay: time/2,duration: time/2 }
	const image_margin=image_size.width*0.2
	
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

	const draft1 = {
		showtransition: {
			hidden: { opacity: 0 },
			show: { opacity: 1, transition: {
				duration: time
			  } }
		},
		hover:{
			black: {
				animate:{opacity: canHover2||canHover3||canHover4?0.5:0},
				transition:{duration: time }
			},
			draft: {
				animate:{
				scale: canHover1? hoverscale:1, x:canHover3 ? -image_margin:(canHover2 ? -image_margin*2:0),
				},
				transtion:{
					duration: time
				}
			},
			display1_1:{
				animate:{
				y: canAnimate||canHover1? -image_size.width*1.82:0
				},
				transition:animate_duration
			},
			display1_2:{
				animate:{
				opacity: canAnimate||canHover1? 1:0
				},
				transition:animate_duration
			},
		},
	}

	const draft2 = {
		showtransition: {
			hidden: { opacity: 0 },
			show: { opacity: 1, transition: {
				duration: time
			  } }
		},
		hover:{
			black: {
				animate:{opacity: canHover1||canHover3||canHover4?0.5:0},
				transition:{duration: time }
			},
			draft: {
				animate:{
					scale: canHover2? hoverscale:1, x:canHover4 ? -image_margin:(canHover3?-image_margin*2:(canHover2?image_margin:0)),
				},
				transtion:{
					duration: time
				}
			},
			display2:{
				animate:{
					y: canAnimate||canHover2? -image_size.width*1.82:0
				},
				transition:animate_duration
			},
		},
	}

	const draft3 = {
		showtransition: {
			hidden: { opacity: 0 },
			show: { opacity: 1, transition: {
				duration: time
			  } }
		},
		hover:{
			black: {
				animate:{opacity: canHover1||canHover2||canHover4?0.5:0}, 
				transition:{duration: time }
			},
			draft: {
				animate:{
					scale: canHover3? hoverscale:1, x:canHover4 ? -image_margin*2:(canHover3?image_margin:0),
				},
				transtion:{
					duration: time
				}
			},
			display3:{
				animate:{
					 x: canAnimate||canHover3? 0:image_size.contentWidth
				},
				transition:animate_duration
			},
		},
	}

	const draft4 = {
		showtransition: {
			hidden: { opacity: 0 },
			show: { opacity: 1, transition: {
				duration: time,
			  },}
		},
		hover:{
			black: {
				animate:{opacity: canHover1||canHover2||canHover3?0.5:0}, 
				transition:{duration: time }
			},
			draft: {
				animate:{
					scale: canHover4? hoverscale:1,x:canHover4 ? image_margin:0,
				},
				transtion:{
					duration: time
				}
			},
			display:{
				animate:{
					 x: canAnimate||canHover4? 0:image_size.contentWidth
				},
				transition:animate_duration
			},
		},
	}

	const text= {
		hidden: {opacity: 0, y:-margin/2 },
		show: {opacity:1, y:0, transition : {
			delay: animate_time+time*3,
			duration: time,
			onComplete: () => {setHover(true);setAnimate(false)},
		}}
	}

	const IphoneMargin = ({first=false}) => {
		const transition = { duration: time*3 }
		return (
			first ? 
			<motion.div transition={transition}><Div w={fold?(image_size.width-image_margin*3)/2:0}/></motion.div>
			:
			<motion.div transition={transition}><Div w={fold?image_margin*2:image_size.width+image_margin}/></motion.div>
		)
	}


  return (
	<Div wFull pt10>
	<EmptyBlock h={(image_size.height/2)*hoverscale+margin}/>
    <motion.div
      initial="hidden"
      whileInView="show"
	  onViewportLeave={()=>{setAnimate(false);setFold(false)}}
      viewport={{ once: once, amount:0 }}
    >
	<motion.ul variants={container}>
		<Div flex flexRow justifyCenter itemsCenter wFull>
			<Div wFull flex flexRow justifyEnd itemsCenter>
				<Div relative>
					<Div absolute flex flexRowReverse>
						<Div relative><Div absolute>
						<DraftCenterAnchor draft={draft4} onMouseEnter={() => setHovered4(true)} onMouseLeave={() => setHovered4(false)} iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} buttonmargin={image_size.buttonmargin} content={
								<>
									<Div absolute imgTag src={IMAGES.appDraft4.initial}></Div>
									<motion.div layout animate={draft4.hover.display.animate} transition={draft4.hover.display.transition}><Div absolute imgTag src={IMAGES.appDraft4.end}></Div></motion.div>
									<IphoneBlackContent iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} animation={draft4.hover.black} />
								</>
						}/>
						</Div></Div>
						<IphoneMargin/>
						<Div relative><Div absolute>
						<DraftCenterAnchor draft={draft3} onMouseEnter={() => setHovered3(true)} onMouseLeave={() => setHovered3(false)} iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} buttonmargin={image_size.buttonmargin} content={
								<>
									<Div absolute imgTag src={IMAGES.appDraft3.initial}></Div>
									<motion.div layout animate={draft3.hover.display3.animate} transition={draft3.hover.display3.transition}><Div absolute imgTag src={IMAGES.appDraft3.end}></Div></motion.div>
									<IphoneBlackContent iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} animation={draft3.hover.black} />
								</>
						}/>
						</Div></Div>
						<IphoneMargin/>
						<Div relative><Div absolute>
						<DraftCenterAnchor draft={draft2} onMouseEnter={() => setHovered2(true)} onMouseLeave={() => setHovered2(false)} iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} buttonmargin={image_size.buttonmargin} content={
								<>
										<motion.div layout animate={draft2.hover.display2.animate} transition={draft2.hover.display2.transition}><Div absolute imgTag src={IMAGES.appDraft2.content}></Div></motion.div>
										<Div absolute imgTag src={IMAGES.appDraft2.tool}></Div>
										<IphoneBlackContent iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} animation={draft2.hover.black} />
								</>
						}/>
						</Div></Div>
						<IphoneMargin/>
						<Div relative><Div absolute>
						<DraftCenterAnchor draft={draft1} onMouseEnter={() => setHovered1(true)} onMouseLeave={() => setHovered1(false)} iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} buttonmargin={image_size.buttonmargin} content={
								<>
									<Div absolute imgTag src={IMAGES.appDraft1.bgback}></Div>
									<motion.div layout animate={draft1.hover.display1_1.animate} transition={draft1.hover.display1_1.transition}><Div absolute imgTag src={IMAGES.appDraft1.content}></Div></motion.div>
									<Div absolute imgTag src={IMAGES.appDraft1.bgfront1}></Div>
									<motion.div layout animate={draft1.hover.display1_2.animate} transition={draft1.hover.display1_2.transition}><Div absolute imgTag src={IMAGES.appDraft1.bgfront2}></Div></motion.div>
									<IphoneBlackContent iphone_w={image_size.width} iphone_h={image_size.height} contentmarginWidth={image_size.contentmarginWidth} contentmarginHeight={image_size.contentmarginHeigth} animation={draft1.hover.black} />
								</>
						}/>
						</Div></Div>
						<IphoneMargin first={true}/>
					</Div>
				</Div>

				<Div w={(image_size.width+image_margin)*3/2}/>
			</Div>
			<Div wFull flex flexRow justifyStart itemsCenter>
				<Div w={image_size.width}/>
				<Div relative>
					<motion.ul variants={text}>
					<Div absolute _translateX1over2 _translateY1over2>
						<Div flex flexCol w={300}>
							<Div fontBold fontSize32 textCenter> 커뮤니티 피드 </Div>
							<Div textGray500 fontSize20 textCenter hFull>피드에서 커뮤니티 내 다양한 홀더들과 편리하게 소통하고 팔로잉 피드에서 관심있는 이야기만 모아보세요.</Div>
						</Div>
					</Div></motion.ul>
				</Div>
			</Div>
		</Div>
	</motion.ul>
	<EmptyBlock h={(image_size.height/2)*hoverscale+margin}/>
    </motion.div>
	</Div>
  );
}




export default function CommunityFeedDraft({time, image_size, margin, hoverscale, animate_time, once, width}) {
  return (<Div>
	<Div selfCenter>
    <Drafts time={time} image_size={image_size} margin={margin} hoverscale={hoverscale} animate_time={animate_time} once={once} />
  	</Div></Div>);
}
