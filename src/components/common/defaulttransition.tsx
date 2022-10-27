import { AnimatePresence, motion } from "framer-motion";

export default function DefaultTransition({ content, show, appear = true, duration = 0.1 }) {
  const topBarAnimation = {
    mount: { opacity: 1, scale: 1 },
    unmount: { opacity: 0, scale: 0.95 },
    transition: { duration: duration },
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={topBarAnimation.unmount} animate={topBarAnimation.mount} exit={topBarAnimation.unmount} transition={topBarAnimation.transition}>
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
