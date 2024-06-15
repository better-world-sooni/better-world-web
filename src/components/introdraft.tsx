import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";

export default function IntroDraft({ time, once, appstore, playstore }) {
  const [canhref, sethref] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: time,
      },
    },
  };

  const text1Animation = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: time,
      },
    },
  };

  const text2Animation = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: time * 0.5,
        duration: time,
      },
    },
  };

  const text3Animation = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: time * 2.0,
        duration: time,
      },
    },
  };

  const linkAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: time * 2.5,
        duration: time,
        onComplete: () => sethref(true),
      },
    },
  };

  return (
		<Div>
			<motion.div initial="hidden" whileInView="show" viewport={{ once: once, amount: 0 }} onViewportLeave={() => sethref(false)}>
				<motion.ul variants={container}>
					<Div relative wFull flex itemsCenter justifyCenter>
						<Div imgTag src={IMAGES.mainbackground} />
						<Div absolute wFull hFull mb300 top={"10vw"} py50 flex flexCol justifyStart itemsCenter>
							<Div flex flexCol justifyCenter w={"55vw"}>
								<motion.li variants={text1Animation}>
									<Div fontSize={"1.7vw"} textCenter fontBold roundedFull whitespaceNowrap>
										프로젝트 별로 흩어진 공지 정보를 모아서{" "}
										<Div spanTag textBWgradient>
											한눈에
										</Div>
										,
									</Div>
								</motion.li>
								<motion.li variants={text2Animation}>
									<Div fontSize={"1.7vw"} textCenter fontBold roundedFull whitespaceNowrap>
										지갑 연결 한 번으로 홀더 커뮤니티 입장까지{" "}
										<Div spanTag textBWgradient>
											간편하게
										</Div>
										,
									</Div>
								</motion.li>
								<motion.li variants={text3Animation}>
									<Div fontSize={"3vw"} textCenter mxAuto fontBold roundedFull mt20 flex flexRow justifyCenter whitespaceNowrap>
										<Div mb={"0.4vw"} selfCenter imgTag maxH={"3vw"} src={IMAGES.logoword.firstGradient} style={{ marginRight: "1.5vw" }} />
										하나로 NFT 완전 정복
									</Div>
								</motion.li>
								<motion.li variants={linkAnimation}>
									<Div flex flexRow justifyCenter style={{ marginTop: "5vw" }} gapX={"2vw"}>
										{canhref ? (
											<Div imgTag h={"3.5vw"} src={IMAGES.downloadOnAppStore} cursorPointer onClick={appstore} />
										) : (
											<Div imgTag h={"3.5vw"} src={IMAGES.downloadOnAppStore} />
										)}
										{canhref ? (
											<Div imgTag h={"3.5vw"} src={IMAGES.downloadOnGooglePlay} cursorPointer onClick={playstore} />
										) : (
											<Div imgTag h={"3.5vw"} src={IMAGES.downloadOnGooglePlay} />
										)}
									</Div>
								</motion.li>
							</Div>
						</Div>
					</Div>
				</motion.ul>
			</motion.div>
		</Div>
	);
}
