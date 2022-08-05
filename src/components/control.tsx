import { motion, MotionConfig, Variants } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";

interface Props {
  emoji: string;
  hueA: number;
  hueB: number;
}
const time=0.5

const image_size={width:243, height:491}
const margin=100
const rotate=10
const hoverscale=1



function Card() {
	const container = {
		hidden: { opacity: 0 },
		show: {
		  opacity: 1,
		  transition: {
			duration: time,
			onUpdate: () => setHover(false),
		  }
		}
	  }
	  
	  const showitem1 = {
		hidden: { opacity: 0, x:-(image_size.width+margin)},
		show: { opacity: 1, x:-(image_size.width+margin), transition: {
			duration: time
		  } }
	  }
	  const showitem2 = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: {
			duration: time
		  } }
	  }
	  const showitem3 = {
		hidden: { opacity: 0, x:(image_size.width+margin) },
		show: { opacity: 1, x:(image_size.width+margin), transition: {
			duration: time
		  } }
	  }
	
	  const takeitem1 = {
		hidden: { opacity: 1 },
		show: { opacity: 1, rotate:-rotate, transition: {
			delay: time*3,
			duration: time*1.5
		  } }
	  }
	  const takeitem2 = {
		hidden: { opacity: 1 },
		show: { opacity: 1, x:-(image_size.width+margin)+image_size.width/5, y:-image_size.height/12, rotate:rotate, transition: {
			delay: time*3,
			duration: time*1.5*1.1
		  } }
	  }
	  const takeitem3 = {
		hidden: { opacity: 1 },
		show: { opacity: 1, x:-2*(image_size.width+margin)+2*image_size.width/5, y:-2*image_size.height/12, rotate:rotate*3, transition: {
			delay: time*3,
			duration: time*1.5*1.2,
		  } }
	  }

	
	const text= {
		hidden: {opacity: 0},
		show: {opacity:1, transition : {
			delay: takeitem3.show.transition.delay+takeitem3.show.transition.duration,
			duration: time,
			onComplete: () => setHover(true),
		}}
	  }
	
	
	const items = {
		hidden: { y : image_size.height-image_size.height/6+margin },
		show: { y : image_size.height-image_size.height/6+margin }
	  }
	const [isHovered1, setHovered1] = useState(false)
	const [isHovered2, setHovered2] = useState(false)
	const [isHovered3, setHovered3] = useState(false)
	const [canHover, setHover] = useState(false)
	const canHover1 = isHovered1&&canHover
	const canHover2 = isHovered2&&canHover
	const canHover3 = isHovered3&&canHover
	const hoveritem1= { scale: canHover1? hoverscale:1, rotate: canHover1? rotate/2:(canHover2||canHover3?-rotate*2:0)}
	const hoveritem2= { scale: canHover2? hoverscale:1, rotate: canHover2? -rotate/2:(canHover1?rotate:(canHover3?-rotate*2:0))}
	const hoveritem3= { scale: canHover3? hoverscale:1, rotate: canHover3? -rotate:(canHover1||canHover2?rotate:0)}
	const blackitem1= {opacity: canHover2||canHover3?0.5:0}
	const blackitem2= {opacity: canHover1||canHover3?0.5:0}
	const blackitem3= {opacity: canHover1||canHover2?0.5:0}
	const hoverdisplay1_1= { y: canHover1? -image_size.width*1.82:0}
	const hoverdisplay1_2= { stdDeviation: canHover1? 0:2}
	const hoverdisplay2= { y: canHover2? -image_size.width*1.82:0}
	const hoverdisplay3= { x: canHover3? 0:image_size.width-26.5}
  return (
	<Div wFull pt10>
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount:"all" }}
    >
	<motion.ul variants={container}>
		<Div flex justifyCenter itemsCenter>
			<Div relative wFull minH={image_size.height+2*margin*2}>
			<motion.li variants={items}>

				<motion.li variants={showitem3}>
				<motion.li variants={takeitem3}>
				<motion.div layout animate={hoveritem3} transition={{duration: time }}>
				<Div absolute _translateYFull _translateX1over2 w={image_size.width-4} h={image_size.height} rounded45 shadow2xl onMouseEnter={() => setHovered3(true)} onMouseLeave={() => setHovered3(false)}>
					<Div relative w={image_size.width} h={image_size.height} right2>
						<Div top11 left13 absolute w={image_size.width-26.5} h={image_size.height-23} rounded25 bgGray300 overflowClip>
							<Div absolute imgTag src={IMAGES.appDraft3.initial}></Div>
							<motion.div layout animate={hoverdisplay3} transition={{delay: time/2,duration: time/2 }}><Div absolute imgTag src={IMAGES.appDraft3.end}></Div></motion.div>
							<motion.div layout animate={blackitem3} transition={{duration: time }}><Div w={image_size.width-26.5} h={image_size.height-23} bgBlack></Div></motion.div>
						</Div>
						<Div absolute w={image_size.width} h={image_size.height} imgTag src={IMAGES.iphon13}></Div>
					</Div>
				</Div></motion.div></motion.li></motion.li>

				<motion.li variants={showitem2}>
				<motion.li variants={takeitem2}>
				<motion.div layout animate={hoveritem2} transition={{duration: time }}>
				<Div absolute _translateYFull _translateX1over2 w={image_size.width-4} h={image_size.height} rounded45 shadow2xl onMouseEnter={() => setHovered2(true)} onMouseLeave={() => setHovered2(false)}>
					<Div relative w={image_size.width} h={image_size.height} right2>
						<Div top11 left13 absolute w={image_size.width-26.5} h={image_size.height-23} rounded25 bgGray300 overflowClip>
							<motion.div layout animate={hoverdisplay2} transition={{delay: time/2,duration: time/2 }}><Div absolute imgTag src={IMAGES.appDraft2.content}></Div></motion.div>
							<Div absolute imgTag src={IMAGES.appDraft2.tool}></Div>
							<motion.div layout animate={blackitem2} transition={{duration: time }}><Div w={image_size.width-26.5} h={image_size.height-23} bgBlack></Div></motion.div>
						</Div>
						<Div absolute w={image_size.width} h={image_size.height} imgTag src={IMAGES.iphon13}></Div>
					</Div>
				</Div></motion.div></motion.li></motion.li>

				<motion.li variants={showitem1}>
				<motion.li variants={takeitem1}>
				<motion.div layout animate={hoveritem1} transition={{duration: time }}>
				<Div absolute _translateYFull _translateX1over2 w={image_size.width-4} h={image_size.height} rounded45 shadow2xl onMouseEnter={() => setHovered1(true)} onMouseLeave={() => setHovered1(false)}>
					<Div relative w={image_size.width} h={image_size.height} right2>
						<Div top11 left13 absolute w={image_size.width-26.5} h={image_size.height-23} rounded25 bgGray300 overflowClip>
							<Div absolute imgTag src={IMAGES.appDraft1.bgback}></Div>
							<motion.div layout animate={hoverdisplay1_1} transition={{delay: time/2,duration: time/2 }}><Div absolute imgTag src={IMAGES.appDraft1.content}></Div></motion.div>
							<motion.div layout animate={hoverdisplay1_2} transition={{delay: time/2,duration: time/2 }}><Div absolute imgTag src={IMAGES.appDraft1.bgfront}></Div></motion.div>
							<motion.div layout animate={blackitem1} transition={{duration: time }}><Div w={image_size.width-26.5} h={image_size.height-23} bgBlack></Div></motion.div>
						</Div>
						<Div absolute w={image_size.width} h={image_size.height} imgTag src={IMAGES.iphon13}></Div>
					</Div>
				</Div></motion.div></motion.li></motion.li>

				<motion.li variants={text}>
				<Div absolute bottom200>
					<Div flexCol translateX1over2 w={300}>
						<Div fontBold fontSize32 textCenter> 커뮤니티 포럼 </Div>
						<Div textGray500 mt20 fontSize20 textCenter hFull>NFT별 프로필로 혜택 이벤트에 응모하고 익명으로 소통하기</Div>
					</Div>
				</Div></motion.li>
			</motion.li>
			</Div>
			{/*  */}
		</Div>
	</motion.ul>
    </motion.div>
	</Div>
  );
}

export default function ContentControll() {
  return (<Div flex flexCol>
	<Div selfCenter>
    <Card />
  	</Div></Div>);
}
