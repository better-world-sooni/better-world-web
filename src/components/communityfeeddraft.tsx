import { motion } from "framer-motion";
import { useState } from "react";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { IphoneBlackContent } from "./iphone";
import { DraftCenterAnchor, factorToPercent, factorTovw, iPhoneHeight, iPhoneWidth } from "./drafts";

function Drafts({ time, mountmargin, hoverscale, animate_time, once, textprops, margin }) {
  const [isHovered1, setHovered1] = useState(false);
  const [isHovered2, setHovered2] = useState(false);
  const [isHovered3, setHovered3] = useState(false);
  const [isHovered4, setHovered4] = useState(false);
  const [canAnimate, setAnimate] = useState(false);
  const [canHover, setHover] = useState(false);
  const canHover1 = isHovered1 && canHover;
  const canHover2 = isHovered2 && canHover;
  const canHover3 = isHovered3 && canHover;
  const canHover4 = isHovered4 && canHover;
  const animate_duration = canAnimate ? { duration: animate_time / 2 } : { delay: time / 2, duration: time / 2 };

  const image_margin = 0.18;
  const rotate = 20;

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

  const draft2 = {
    showtransition: {
      hidden: { x: "0%", rotate: 0, y: "-1vw" },
      show: {
        x: factorTovw(iPhoneWidth - margin - iPhoneHeight * image_margin * 1.2 + iPhoneHeight * image_margin),
        y: "1vw",
        rotate: -rotate,
        transition: {
          delay: time * 2 + animate_time / 2,
          duration: time * 1.1,
        },
      },
    },
    hover: {
      black: {
        animate: { opacity: canHover1 || canHover3 || canHover4 ? 0.5 : 0 },
        transition: { duration: time },
      },
      draft: {
        animate: {
          scale: canHover2 ? hoverscale : 1,
          rotate: canHover3 || canHover4 ? -rotate / 3 : canHover2 ? rotate / 3 : 0,
          x: canHover3 || canHover4 ? "-3vw" : "0vw",
        },
        transtion: {
          duration: time,
        },
      },
      display2: {
        animate: {
          backgroundPositionY: canAnimate || canHover2 ? "100%" : "0%",
        },
        transition: animate_duration,
      },
    },
  };

  const draft3 = {
    showtransition: {
      hidden: { x: "0%", rotate: 0, y: "-1vw" },
      show: {
        x: factorTovw(-margin),
        y: "-1vw",
        rotate: 0,
        transition: {
          delay: time * 2 + animate_time / 2,
          duration: time * 1.1 * 1.1 * 1.1,
        },
      },
    },
    hover: {
      black: {
        animate: { opacity: canHover1 || canHover2 || canHover4 ? 0.5 : 0 },
        transition: { duration: time },
      },
      draft: {
        animate: {
          scale: canHover3 ? hoverscale : 1,
          rotate: canHover2 ? rotate : canHover4 ? -rotate : 0,
          x: canHover2 ? "3vw" : canHover4 ? "-3vw" : "0vw",
        },
        transtion: {
          duration: time,
        },
      },
      display3: {
        animate: {
          x: canAnimate || canHover3 ? "0%" : "100%",
        },
        transition: animate_duration,
      },
    },
  };

  const draft4 = {
    showtransition: {
      hidden: { x: "0%", rotate: 0, y: "-1vw" },
      show: {
        x: factorTovw(-(iPhoneHeight * image_margin + iPhoneWidth) - margin + iPhoneHeight * image_margin * 1.2),
        y: "0vw",
        rotate: rotate,
        transition: {
          delay: time * 2 + animate_time / 2,
          duration: time * 1.1 * 1.1 * 1.1,
        },
      },
    },
    hover: {
      black: {
        animate: { opacity: canHover1 || canHover2 || canHover3 ? 0.5 : 0 },
        transition: { duration: time },
      },
      draft: {
        animate: {
          scale: canHover4 ? hoverscale : 1,
          rotate: canHover2 || canHover3 ? rotate / 3 : canHover4 ? -rotate / 3 : 0,
          x: canHover2 || canHover3 ? "3vw" : "0vw",
        },
        transtion: {
          duration: time,
        },
      },
      display: {
        animate: {
          x: canAnimate || canHover4 ? "0%" : "100%",
        },
        transition: animate_duration,
      },
    },
  };

  const text = {
    hidden: { opacity: 0, y: -mountmargin / 2 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: animate_time + time * 2,
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
          setHovered3(false);
          setHovered4(false);
        }}
        viewport={{ once: once, amount: 0 }}
        style={{ marginTop: factorTovw((iPhoneHeight / 2) * hoverscale + 4), paddingBottom: factorTovw((iPhoneHeight / 2) * hoverscale + 4) }}
      >
        <motion.ul variants={container}>
          <Div flex flexRow justifyCenter itemsCenter wFull>
            <Div w={"50%"} flex flexRow justifyEnd itemsCenter>
              <Div relative right={factorTovw(iPhoneHeight * image_margin + iPhoneWidth)}>
                <Div absolute flex flexRowReverse gapX={factorTovw(iPhoneHeight * image_margin)}>
                  <DraftCenterAnchor
                    draft={draft4}
                    onMouseEnter={() => setHovered4(true)}
                    onMouseLeave={() => setHovered4(false)}
                    content={
                      <>
                        <Div absolute wFull hFull imgTag src={IMAGES.appDraft4.initial}></Div>
                        <motion.div
                          animate={draft4.hover.display.animate}
                          transition={draft4.hover.display.transition}
                          style={{ position: "absolute", width: "100%", height: "100%" }}
                        >
                          <Div wFull hFull imgTag src={IMAGES.appDraft4.end}></Div>
                        </motion.div>
                        <IphoneBlackContent animation={draft4.hover.black} />
                      </>
                    }
                  />
                  <DraftCenterAnchor
                    draft={draft3}
                    onMouseEnter={() => setHovered3(true)}
                    onMouseLeave={() => setHovered3(false)}
                    content={
                      <>
                        <Div absolute wFull hFull imgTag src={IMAGES.appDraft3.initial}></Div>
                        <motion.div
                          animate={draft3.hover.display3.animate}
                          transition={draft3.hover.display3.transition}
                          style={{ position: "absolute", width: "100%", height: "100%" }}
                        >
                          <Div hFull wFull imgTag src={IMAGES.appDraft3.end}></Div>
                        </motion.div>
                        <IphoneBlackContent animation={draft3.hover.black} />
                      </>
                    }
                  />
                  <DraftCenterAnchor
                    draft={draft2}
                    onMouseEnter={() => setHovered2(true)}
                    onMouseLeave={() => setHovered2(false)}
                    content={
                      <>
                        <ContentImage animate={draft2.hover.display2.animate} transition={draft2.hover.display2.transition} src={IMAGES.appDraft2.content} />
                        <ContentImage src={IMAGES.appDraft2.tool} />
                        <IphoneBlackContent animation={draft2.hover.black} />
                      </>
                    }
                  />
                </Div>
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
                        다른 NFT 홀더들과 편리하게
                        <br />
                        소통하고 교류하세요.
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

const ContentImage = ({ animate = null, transition = null, scrollProgress = null, src }) => {
  return scrollProgress ? (
    <motion.div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPositionX: "center",
        backgroundPositionY: scrollProgress,
      }}
    />
  ) : animate && transition ? (
    <motion.div
      animate={animate}
      transition={transition}
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPositionX: "center",
      }}
    />
  ) : (
    <Div absolute wFull imgTag src={src} />
  );
};

export default function CommunityFeedDraft({ time, textprops, mountmargin, hoverscale, animate_time, once, margin }) {
  return (
    <Div>
      <Div selfCenter>
        <Drafts time={time} mountmargin={mountmargin} textprops={textprops} hoverscale={hoverscale} animate_time={animate_time} once={once} margin={margin} />
      </Div>
    </Div>
  );
}
