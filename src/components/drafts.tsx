import Div from "src/components/Div";
import { motion } from "framer-motion";
import SocialDraft from "./socialDraft";
import HolderVerificationDraft from "./holderverificationdraft";
import { Iphone, iphoneSize } from "./iphone";
import AggregatorDraft from "./aggregatorDraft";
import DonationDraft from "./\bdonationDraft";

const time = 0.5;
const animate_time = time * 3;
const once = false;
const mountmargin = 100;
const hoverscale = 1.1;
const iPhoneWidthPercent = 20;
const textprops = {
  title: {
    fontBold: true,
    fontSize: "2.5vw",
    textCenter: true,
  },
  content: {
    textGray500: true,
    fontSize: "1.8vw",
    textCenter: true,
  },
};
const margin = 20;

export const iPhoneWidth = iPhoneWidthPercent;
export const iPhoneHeight = (iPhoneWidthPercent * 2380) / 1180;
export const iPhoneContentWidth = iPhoneWidthPercent * ((1 - iphoneSize.contentWidth) / 2 + iphoneSize.buttonmargin) * 2;
export const iPhoneContentHeight = (iPhoneWidthPercent * (1 - iphoneSize.contentHeight) * 1180) / 2380;
export const factorTovw = (v) => `${v}vw`;
export const factorToPercent = (v) => `${v * 100}%`;

export default function Drafts({ minW = 0 }) {
  const minWProps = minW != 0 ? { wFull: true } : { minW: minW };
  return (
    <Div flex flexCol {...minWProps}>
      <Div selfCenter wFull>
        <AggregatorDraft
          margin={margin}
          time={time}
          mountmargin={mountmargin}
          textprops={textprops}
          hoverscale={hoverscale}
          animate_time={animate_time}
          once={once}
        />
        <SocialDraft
          margin={margin}
          time={time}
          mountmargin={mountmargin}
          textprops={textprops}
          hoverscale={hoverscale}
          animate_time={animate_time}
          once={once}
        />
        <DonationDraft
          margin={margin}
          time={time}
          mountmargin={mountmargin}
          textprops={textprops}
          hoverscale={hoverscale}
          animate_time={animate_time}
          once={once}
        />
        <HolderVerificationDraft
          margin={margin}
          time={time}
          mountmargin={mountmargin}
          textprops={textprops}
          hoverscale={hoverscale}
          animate_time={animate_time}
          once={once}
        />
      </Div>
    </Div>
  );
}

export function DraftCenterAnchor({ draft, onMouseEnter, onMouseLeave, content, left = "", right = "" }) {
  return draft.showtransition ? (
    <motion.li variants={draft.showtransition} style={{ position: "relative", width: "100%", height: "100%" }}>
      <motion.div animate={draft.hover.draft.animate} transition={draft.hover.draft.transtion}>
        <Iphone relative w={factorTovw(iPhoneWidth)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {content}
        </Iphone>
      </motion.div>
    </motion.li>
  ) : (
    <Div absolute _translateY1over2 _translateX1over2 left={left} right={right}>
      <motion.div animate={draft.hover.draft.animate} transition={draft.hover.draft.transtion} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Iphone relative w={factorTovw(iPhoneWidth)}>
          {content}
        </Iphone>
      </motion.div>
    </Div>
  );
}

export const ContentImage = ({ animate = null, transition = null, scrollProgress = null, src }) => {
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
    <Div
      absolute
      wFull
      hFull
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPositionX: "center",
      }}
    />
  );
};
