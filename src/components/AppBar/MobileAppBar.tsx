import AppBarDashboardButton from "@/components/AppBar/AppBarDashboardButton";
import AppBarSearchButton from "@/components/AppBar/AppBarSearchButton";
import AppBarSignInOutButton from "@/components/AppBar/AppBarSignInOutButton";
import {useProfile} from "@/features/Member/hooks";
import {ReactComponent as LogoPositive} from "assets/logo/logo-positive.svg";
import {motion} from "framer-motion";
import {Link, useLocation} from "react-router-dom";

export default function MobileAppBar() {
  const location = useLocation();
  const isReading = location.pathname.endsWith("read");
  const {profile} = useProfile();

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
        {/* {profile?.role === "ROLE_ADMIN" ? (
          <Link
            className="me-2 px-4 py-1 bg-[#242424] rounded-md text-white"
            to="/admin/statistics">
            관리자 통계보기
          </Link>
        ) : null} */}
        <AppBarDashboardButton />
        {/* <AppBarSearchButton /> */}
        {/* <AppBarSignInOutButton /> */}
      </li>
    </motion.nav>
  );
}

const variants = {
  active: {y: 0},
  inactive: {y: "-100%"},
};
