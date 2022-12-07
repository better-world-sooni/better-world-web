import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
import React, { useState } from "react";
import Drafts, { initialDelay } from "src/components/drafts";
import IntroDraft from "src/components/introdraft";
import FooterDraft from "src/components/footerdraft";
import { href } from "src/modules/routeHelper";
import { IMAGES } from "src/modules/images";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import LINKS from "src/modules/links";

export default function Home({ currentUser, currentNft }) {
  const appstore = () => {
    href(LINKS.appstore);
  };
  const playstore = () => {
    href(LINKS.playstore);
  };
  const minW = 0;
  const minWProps = minW ? { minW: minW } : { wFull: true };
  if (isMobile) return <MobileMain appstore={appstore} playstore={playstore} />;
  return (
    <>
      {initialDelay <= 0 && <MainTopBar currentUser={currentUser} currentNft={currentNft} />}
      <Div flex itemsCenter justifyCenter {...minWProps}>
        <IntroDraft time={0.5} once={false} appstore={appstore} playstore={playstore} />
      </Div>
      <Drafts minW={minW} />
      <Div h={700} flex itemsCenter justifyCenter relative {...minWProps}>
        <FooterDraft time={0.5} once={false} appstore={appstore} playstore={playstore} />
        <Div absolute bottom0 left0>
          <Footer showLogo={false} />
        </Div>
      </Div>
    </>
  );
}

function MobileMain({ appstore, playstore }) {
  const [canhref, sethref] = useState(false);
  const time = 0.5;
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: time,
      },
    },
  };
  const bgAnimation = {
    hidden: { x: -50 + 30, y: 30, scale: 1.5 },
    show: {
      x: 0 + 30,
      y: 30,
      scale: 1,
      transition: {
        duration: time * 2,
      },
    },
  };

  const contentAnimation = {
    hidden: { opacity: 0, x: 20 + 30, y: 30, scale: 1.5 },
    show: {
      opacity: 1,
      x: 0 + 30,
      y: 30,
      scale: 1,
      transition: {
        delay: time * 2,
        duration: time,
      },
    },
  };
  const logotextAnimation = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: time * 2.5,
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
        delay: time * 3,
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
        delay: time * 3.5,
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
        delay: time * 4.5,
        duration: time,
      },
    },
  };

  const linkAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: time * 5,
        duration: time,
        onComplete: () => sethref(true),
      },
    },
  };

  const informAnimation = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: time * 5,
        duration: time,
      },
    },
  };
  return (
    <>
      <Div wFull />
      <Div wFull />
      <Div wFull>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0 }} onViewportLeave={() => sethref(false)}>
          <motion.ul variants={container}>
            <Div itemsCenter justifyCenter wFull hFull>
              <Div mt150 mb100 wFull flex flexCol itemsCenter justifyCenter>
                <Div relative wFull h60 w60>
                  <Div absolute _translateY1over2 _translateX1over2>
                    <motion.li variants={bgAnimation}>
                      <Div imgTag h60 src={IMAGES.bwLogo.bg} />
                    </motion.li>
                  </Div>
                  <Div absolute _translateY1over2 _translateX1over2>
                    <motion.li variants={contentAnimation}>
                      <Div imgTag h60 src={IMAGES.bwLogo.content} />
                    </motion.li>
                  </Div>
                </Div>
                <motion.li variants={logotextAnimation}>
                  <Div mt5 imgTag h20 src={IMAGES.logoword.firstBlack} whitespaceNowrap />
                </motion.li>
              </Div>

              <Div wFull itemsCenter justifyCenter>
                <motion.li variants={text1Animation}>
                  <Div fontSize17 textCenter fontBold roundedFull whitespaceNowrap mb10>
                    프로젝트 별로 흩어진 공지 정보를 모아서{" "}
                    <Div spanTag textBWgradient>
                      한눈에
                    </Div>
                    ,
                  </Div>
                </motion.li>
                <motion.li variants={text2Animation}>
                  <Div fontSize17 textCenter fontBold roundedFull whitespaceNowrap mb30>
                    지갑 연결 한 번으로 홀더 커뮤니티 입장까지{" "}
                    <Div spanTag textBWgradient>
                      간편하게
                    </Div>
                    ,
                  </Div>
                </motion.li>
                <motion.li variants={text3Animation}>
                  <Div fontSize25 textCenter mxAuto fontBold roundedFull mt5>
                    <Div flex flexRow whitespaceNowrap itemsCenter justifyCenter>
                      <Div mb2 ml10 mr10 selfCenter imgTag maxH={25} src={IMAGES.logoword.firstGradient} />
                      하나로
                    </Div>
                  </Div>
                  <Div fontSize25 textCenter mxAuto fontBold roundedFull mt5>
                    NFT 완전 정복
                  </Div>
                </motion.li>
                <motion.li variants={linkAnimation}>
                  <Div mt40 flex justifyCenter gapX={10}>
                    {canhref ? (
                      <Div imgTag h35 src={IMAGES.downloadOnAppStore} cursorPointer onClick={appstore} />
                    ) : (
                      <Div imgTag h35 src={IMAGES.downloadOnAppStore} />
                    )}
                    {canhref ? (
                      <Div imgTag h35 src={IMAGES.downloadOnGooglePlay} cursorPointer onClick={playstore} />
                    ) : (
                      <Div imgTag h35 src={IMAGES.downloadOnGooglePlay} />
                    )}
                  </Div>
                </motion.li>
              </Div>
              <Div hFull wFull itemsCenter justifyCenter mb150 mt10 fontBold textGray400>
                <motion.li variants={informAnimation}>
                  <Div fontSize16 textGray800 textCenter mxAuto roundedFull>
                    회원가입은 PC를 이용해주세요.
                  </Div>
                </motion.li>
              </Div>
            </Div>
          </motion.ul>
        </motion.div>
        <Div wFull bgGray100 borderT1 itemsCenter justifyCenter textCenter fontSize10 textGray500 py50>
          <Div>
            BetterWorld from{" "}
            <Div spanTag textGray700 aTag href={LINKS.soonilabs}>
              SOONI Labs
            </Div>
            <br></br>© BetterWorld. ALL RIGHTS RESERVED
          </Div>
        </Div>
      </Div>
    </>
  );
}
