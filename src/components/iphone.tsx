import { motion } from "framer-motion";
import Div from "src/components/Div";
import { IMAGES } from "src/modules/images";
import { DivPropsType } from "src/types/DivPropsType";

export const iphoneSize = {
  contentmarginWidth: 57 / 1180,
  contentmarginHeigth: 55 / 2380,
  buttonmargin: 9 / 1180,
  rounded: 190 / 1180,
  contentWidth: 1068 / 1180,
  contentHeight: 2270 / 2380,
};

const factorToPercent = (v) => `${v * 100}%`;

export const Iphone = (props: DivPropsType) => {
  return (
    <Div {...props}>
      <Div relative wFull>
        <Div absolute px={factorToPercent(iphoneSize.buttonmargin)} w={factorToPercent(1)} h={factorToPercent(1)}>
          <Div wFull hFull style={{ borderRadius: factorToPercent(iphoneSize.rounded) }} shadow2xl />
        </Div>
        <Div
          absolute
          overflowHidden
          style={{ borderRadius: factorToPercent(iphoneSize.rounded), width: factorToPercent(1), height: factorToPercent(1) }}
          py={factorToPercent(1 - iphoneSize.contentHeight)}
          px={factorToPercent((1 - iphoneSize.contentWidth) / 2 + iphoneSize.buttonmargin)}
        >
          <Div relative hFull wFull overflowHidden>
            {props.children}
          </Div>
        </Div>
        <Div relative wFull imgTag src={IMAGES.iphon13} />
      </Div>
    </Div>
  );
};

export function IphoneBlackContent({ animation }) {
  return (
    <motion.div animate={animation.animate} transition={animation.transition} style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Div wFull hFull bgBlack />
    </motion.div>
  );
}
