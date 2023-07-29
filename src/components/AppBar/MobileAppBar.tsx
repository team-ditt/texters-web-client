import AppBarDashboardButton from "@/components/AppBar/AppBarDashboardButton";
import AppBarSearchButton from "@/components/AppBar/AppBarSearchButton";
import AppBarSignInOutButton from "@/components/AppBar/AppBarSignInOutButton";
import {ReactComponent as LogoPositive} from "assets/logo/logo-positive.svg";
import {motion} from "framer-motion";
import {Link, useLocation} from "react-router-dom";

export default function MobileAppBar() {
  const location = useLocation();
  const isReading = location.pathname.endsWith("read");

  return (
    <motion.nav
      className="fixed top-0 left-auto w-full max-w-[850px] h-16 ps-6 pe-4 bg-white flex justify-between items-center z-[1000]"
      variants={variants}
      animate={isReading ? "inactive" : "active"}
      transition={{ease: "easeInOut"}}>
      <Link to="/">
        <LogoPositive width={108} />
      </Link>
      <li className="list-none flex items-center">
        <AppBarDashboardButton />
        <AppBarSearchButton />
        <AppBarSignInOutButton />
      </li>
    </motion.nav>
  );
}

const variants = {
  active: {y: 0},
  inactive: {y: "-100%"},
};
