import { AnimatePresence, motion } from "framer-motion";

export default function DefaultTransition({ content, show, appear = true, duration = 0.1 }) {
  const animation = {
    mount: { opacity: 1, scale: 1 },
    unmount: { opacity: 0, scale: 0.95 },
    transition: { duration: duration },
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={animation.unmount} animate={animation.mount} exit={animation.unmount} transition={animation.transition}>
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
