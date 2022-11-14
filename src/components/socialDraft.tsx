import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { IphoneBlackContent } from "./iphone";
import { ContentImage, DraftCenterAnchor, factorToPercent, factorTovw, initialDelay, iPhoneHeight, iPhoneWidth } from "./drafts";

function Drafts({ time, mountmargin, hoverscale, animate_time, once, textprops, margin }) {
  const [isHovered1, setHovered1] = useState(false);
  const [isHovered2, setHovered2] = useState(false);
  const [canAnimate, setAnimate] = useState(false);
  const [canHover, setHover] = useState(false);
  const canHover1 = isHovered1 && canHover;
  const canHover2 = isHovered2 && canHover;
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

  const draft1 = {
    hover: {
      black: {
        animate: { opacity: canHover2 ? 0.5 : 0 },
        transition: { duration: time },
      },
      draft: {
        animate: {
          scale: canHover1 ? hoverscale : 1,
        },
        transtion: {
          duration: time,
        },
      },
      display2: {
        animate: {
          backgroundPositionY: canAnimate || canHover1 ? "100%" : "0%",
        },
        transition: animate_duration,
      },
    },
  };

  const draft2 = {
    hover: {
      black: {
        animate: { opacity: canHover1 ? 0.5 : 0 },
        transition: { duration: time },
      },
      draft: {
        animate: {
          scale: canHover2 ? hoverscale : 1,
        },
        transtion: {
          duration: time,
        },
      },
      display: {
        animate: {
          x: canAnimate || canHover2 ? "0%" : "100%",
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
          setHovered1(false);
          setHovered2(false);
        }}
        viewport={{ once: once, amount: 0 }}
        style={{ marginTop: factorTovw((iPhoneHeight / 2) * hoverscale + 4), paddingBottom: factorTovw((iPhoneHeight / 2) * hoverscale + 4) }}
      >
        <motion.ul variants={container}>
          <Div flex flexRow justifyCenter itemsCenter wFull>
            <Div w={"50%"} flex flexRow justifyEnd itemsCenter>
              <Div relative flex flexRow right={factorTovw(margin - (iPhoneWidth * 11) / 10)} gapX={factorTovw(iPhoneWidth / 5)} flexRowReverse>
                <DraftCenterAnchor
                  draft={draft2}
                  onMouseEnter={() => setHovered2(true)}
                  onMouseLeave={() => setHovered2(false)}
                  right={factorTovw((-iPhoneWidth * 6) / 10)}
                  content={
                    <>
                      <ContentImage src={IMAGES.chatDraft.feed} />
                      <ContentImage animate={draft2.hover.display.animate} transition={draft2.hover.display.transition} src={IMAGES.chatDraft.detail} />
                      <IphoneBlackContent animation={draft2.hover.black} />
                    </>
                  }
                />
                <DraftCenterAnchor
                  draft={draft1}
                  onMouseEnter={() => setHovered1(true)}
                  onMouseLeave={() => setHovered1(false)}
                  right={factorTovw((iPhoneWidth * 6) / 10)}
                  content={
                    <>
                      <ContentImage animate={draft1.hover.display2.animate} transition={draft1.hover.display2.transition} src={IMAGES.socialDraft.feed} />
                      <ContentImage src={IMAGES.socialDraft.header} />
                      <IphoneBlackContent animation={draft1.hover.black} />
                    </>
                  }
                />
              </Div>
            </Div>
            <Div w={"50%"} flex flexRow justifyStart itemsCenter>
              <Div relative left={factorTovw(margin)}>
                <motion.ul variants={text}>
                  <Div absolute _translateX1over2 _translateY1over2>
                    <Div flex flexCol>
                      <Div whitespaceNowrap {...textprops.title}>
                        {" "}
                        소셜 피드{" "}
                      </Div>
                      <Div whitespaceNowrap {...textprops.content}>
                        나만의 유일무이한 NFT 계정으로 <br />
                        인증된 홀더들과 커뮤니티 경계없이
                        <br />
                        편리하고 안전하게 교류하세요.
                      </Div>
                    </Div>
                  </Div>
                </motion.ul>
              </Div>
            </Div>
          </Div>
        </motion.ul>
      </motion.div>
    </Div>
  );
}

export default function SocialDraft({ time, textprops, mountmargin, hoverscale, animate_time, once, margin }) {
  return (
    <Div>
      <Div selfCenter>
        <Drafts time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once} margin={margin} />
      </Div>
    </Div>
  );
}
