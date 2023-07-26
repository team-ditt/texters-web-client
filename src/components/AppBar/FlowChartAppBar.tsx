import AppBarDashboardButton from "@/components/AppBar/AppBarDashboardButton";
import AppBarSignInOutButton from "@/components/AppBar/AppBarSignInOutButton";
import {ReactComponent as LogoPositive} from "assets/logo/logo-positive.svg";
import {AnimatePresence, motion} from "framer-motion";
import {Link} from "react-router-dom";

type Props = {
  title: string;
};

export default function FlowChartAppBar({title}: Props) {
  return (
    <AnimatePresence>
      <motion.nav
        className="fixed inset-0 mx-auto my-0 h-14 ps-6 pe-4 bg-white flex justify-between items-center z-[1000]"
        initial={{y: "-100%"}}
        animate={{y: 0}}
        exit={{y: "-100%"}}
        transition={{ease: "easeInOut"}}>
        <Link className="z-10" to="/">
          <LogoPositive width={108} />
        </Link>
        <li className="list-none flex items-center z-10">
          <AppBarDashboardButton />
          <AppBarSignInOutButton />
        </li>

        <h1 className="absolute inset-0 m-auto flex justify-center items-center font-bold z-0">
          {title}
        </h1>
      </motion.nav>
    </AnimatePresence>
  );
}
