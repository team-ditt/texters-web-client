import {HTMLMotionProps, motion} from "framer-motion";
import {HTMLAttributes, ReactNode} from "react";

type Props = HTMLAttributes<HTMLDivElement> &
  HTMLMotionProps<"div"> & {
    children?: ReactNode | ReactNode[];
  };

export default function AnimatedMobilePageContainer({className, children, ...props}: Props) {
  return (
    <motion.div
      className={`mobile-view ${className}`}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.1}}
      {...props}>
      {children}
    </motion.div>
  );
}
