import {HTMLMotionProps, motion} from "framer-motion";
import {HTMLAttributes, ReactNode} from "react";

type Props = HTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<"button"> & {
    disabled?: boolean;
    children?: ReactNode | ReactNode[];
  };

export default function FlatButton({className, disabled = false, children, ...props}: Props) {
  return (
    <motion.button
      className={`w-full h-[52px] rounded-md text-white text-[18px] font-bold ${className}`}
      variants={variants}
      animate={disabled ? "inactive" : "active"}
      disabled={disabled}
      {...props}>
      {children}
    </motion.button>
  );
}

const variants = {
  active: {backgroundColor: "#383838"},
  inactive: {backgroundColor: "#CECECE", transition: {duration: 0.1}},
};
