import AppBarDashboardButton from "@/components/AppBar/AppBarDashboardButton";
import AppBarSignInOutButton from "@/components/AppBar/AppBarSignInOutButton";
import {ReactComponent as LogoPositive} from "assets/logo/logo-positive.svg";
import {Link} from "react-router-dom";

export default function DesktopAppBar() {
  return (
    <nav className="fixed max-w-[1280px] inset-0 mx-auto my-0 h-20 ps-6 pe-4 bg-white flex justify-between items-center z-[1000]">
      <Link to="/">
        <LogoPositive width={108} />
      </Link>
      <li className="list-none flex items-center">
        <AppBarDashboardButton />
        <AppBarSignInOutButton />
      </li>
    </nav>
  );
}
