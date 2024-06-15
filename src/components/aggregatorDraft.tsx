import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { ContentImage, DraftCenterAnchor, factorTovw, initialDelay, iPhoneHeight } from "./drafts";
import Col from "./Col";

function Drafts({ time, mountmargin, hoverscale, animate_time, once, textprops, margin }) {
	const [isHovered, setHovered] = useState(false);
	const [canAnimate, setAnimate] = useState(false);
	const [canHover, setHover] = useState(false);
	const isHover = isHovered && canHover;
	const animate_duration = canAnimate ? { duration: animate_time / 2 } : { delay: time / 2, duration: time / 2 };

	const container = {
		hidden: { opacity: 0, y: -mountmargin },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				delay: initialDelay,
				duration: time,
				onUpdate: () => setHover(false),
				onComplete: () => setAnimate(true),
			},
		},
	};

	const draft = {
		hover: {
			draft: {
				animate: {
					scale: isHover ? hoverscale : 1,
				},
				transtion: {
					duration: time,
				},
			},
			display: {
				animate: {
					x: canAnimate || isHover ? "0%" : "100%",
				},
				transition: animate_duration,
			},
		},
	};

	const text = {
		hidden: { opacity: 1 },
		show: {
			opacity: 1,
			transition: {
				delay: initialDelay + animate_time,
				duration: time,
				onComplete: () => {
					setHover(true);
					setAnimate(false);
				},
			},
		},
	};

	return (
		<Div wFull pt10>
			<motion.div
				initial="hidden"
				whileInView="show"
				onViewportLeave={() => {
					setAnimate(false);
					setHover(false);
				}}
				viewport={{ once: once, amount: 0 }}
				style={{ marginTop: factorTovw((iPhoneHeight / 2) * hoverscale + 4), paddingBottom: factorTovw((iPhoneHeight / 2) * hoverscale + 4) }}
			>
				<motion.ul variants={container}>
					<Div flex flexRow justifyCenter itemsCenter wFull>
						<Div w={"50%"} flex flexRow justifyEnd itemsCenter>
							<Div relative right={factorTovw(margin)}>
								<motion.ul variants={text}>
									<Div absolute _translateX1over2 _translateY1over2>
										<Div flex flexCol>
											<Div whitespaceNowrap {...textprops.title}>
												{" "}
												NFT 핵심 정보 모아보기
											</Div>
											<Div whitespaceNowrap {...textprops.content}>
												내가 보유한 NFT 프로젝트의 중요한 공지들을 <br /> 놓치지 말고 한눈에 확인하세요
											</Div>
										</Div>
									</Div>
								</motion.ul>
							</Div>
						</Div>
						<Div w={"50%"} flex flexRow justifyStart itemsCenter>
							<Div relative left={factorTovw(margin)}>
								<DraftCenterAnchor
									draft={draft}
									onMouseEnter={() => setHovered(true)}
									onMouseLeave={() => setHovered(false)}
									content={
										<>
											<ContentImage src={IMAGES.aggregatorDraft.feed} />
											<ContentImage
												src={IMAGES.aggregatorDraft.detail}
												animate={draft.hover.display.animate}
												transition={draft.hover.display.transition}
											/>
										</>
									}
								/>
							</Div>
						</Div>
					</Div>
				</motion.ul>
			</motion.div>
		</Div>
	);
}

export default function AggregatorDraft({ time, textprops, mountmargin, hoverscale, animate_time, once, margin }) {
	return (
		<Drafts
			time={time}
			mountmargin={mountmargin}
			textprops={textprops}
			hoverscale={hoverscale}
			animate_time={animate_time}
			once={once}
			margin={margin}
		/>
	);
}
