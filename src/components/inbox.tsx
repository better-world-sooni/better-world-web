import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { DraftCenterAnchor, factorTovw, iPhoneHeight } from "./drafts";

function Drafts({ time, mountmargin, hoverscale, animate_time, once, textprops, margin }) {
  const [isHovered, setHovered] = useState(false);
  const [canAnimate, setAnimate] = useState(false);
  const [canHover, setHover] = useState(false);
  const canHover5 = isHovered && canHover;
  const animate_duration = canAnimate ? { duration: animate_time / 2 } : { delay: time / 2, duration: time / 2 };

  const container = {
    hidden: { opacity: 0, y: -mountmargin },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: time,
        onUpdate: () => setHover(false),
        onComplete: () => setAnimate(true),
      },
    },
  };

  const draft5 = {
    hover: {
      draft: {
        animate: {
          scale: canHover5 ? hoverscale : 1,
        },
        transtion: {
          duration: time,
        },
      },
      display: {
        animate: {
          x: canAnimate || canHover5 ? "0%" : "100%",
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
        delay: animate_time,
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
                        NFT 커뮤니티 공지 알림 탭
                      </Div>
                      <Div whitespaceNowrap {...textprops.content}>
                        내가 보유한 NFT의 중요한 공지들을 <br /> 놓치지 말고 한눈에 확인하세요
                      </Div>
                    </Div>
                  </Div>
                </motion.ul>
              </Div>
            </Div>
            <Div w={"50%"} flex flexRow justifyStart itemsCenter>
              <Div relative left={factorTovw(margin)}>
                <DraftCenterAnchor
                  draft={draft5}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  content={
                    <>
                      <Div absolute wFull hFull imgTag src={IMAGES.appDraft7.initial}></Div>
                      <motion.div
                        animate={draft5.hover.display.animate}
                        transition={draft5.hover.display.transition}
                        style={{ position: "absolute", width: "100%", height: "100%" }}
                      >
                        <Div wFull hFull imgTag src={IMAGES.appDraft7.end}></Div>
                      </motion.div>
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

export default function InboxDraft({ time, textprops, mountmargin, hoverscale, animate_time, once, margin }) {
  return (
    <Div>
      <Div selfCenter>
        <Drafts time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once} margin={margin} />
      </Div>
    </Div>
  );
}
