import {api} from "@/api";
import {keys} from "@/constants";
import {useSignOut} from "@/features/Auth/hooks";
import {useAuthStore} from "@/stores";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as SearchIcon} from "assets/icons/search.svg";
import {ReactComponent as SignInIcon} from "assets/icons/sign-in.svg";
import {ReactComponent as SignOutIcon} from "assets/icons/sign-out.svg";
import {ReactComponent as ToDashboardIcon} from "assets/icons/to-dashboard.svg";
import {ReactComponent as LogoPositive} from "assets/logo/logo-positive.svg";
import {Link} from "react-router-dom";

export default function MobileAppBar() {
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const {data: profile} = useQuery([keys.GET_MY_PROFILE_QUERY], api.members.fetchProfile, {
    enabled: didSignIn,
  });
  const {mutate: signOut} = useSignOut();

  return (
    <nav className="fixed top-0 left-0 w-full max-w-[850px] h-16 ps-6 pe-4 bg-white flex justify-between items-center z-[1000]">
      <Link to="/">
        <LogoPositive width={108} />
      </Link>
      <li className="list-none flex items-center">
        <Link className="p-1.5" to={`/members/${profile?.id}/books`}>
          <ToDashboardIcon />
        </Link>
        <Link className="p-1.5" to="/books">
          <SearchIcon />
        </Link>
        {didSignIn ? (
          <button onClick={signOut as () => void}>
            <SignOutIcon />
          </button>
        ) : (
          <Link className="p-1.5" to="/sign-in">
            <SignInIcon />
          </Link>
        )}
      </li>
    </nav>
  );
}
