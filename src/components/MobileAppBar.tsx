import {api} from "@/api";
import {keys} from "@/constants";
import {useSignOut} from "@/features/Auth/hooks";
import {useAuthStore} from "@/stores";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as SignInIcon} from "assets/icons/sign-in.svg";
import {ReactComponent as SignOutIcon} from "assets/icons/sign-out.svg";
import {ReactComponent as ToDashboardIcon} from "assets/icons/to-dashboard.svg";
import {Link} from "react-router-dom";

export default function MobileAppBar() {
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const {data: profile} = useQuery([keys.GET_MY_PROFILE_QUERY], api.members.fetchProfile, {
    enabled: didSignIn,
  });
  const {mutate: signOut} = useSignOut();

  return (
    <nav className="w-full max-w-[850px] h-16 px-6 flex justify-between items-center">
      <Link to="/">
        <img className="w-[108px] h-5" src="assets/logo/logo-positive.png" />
      </Link>
      <li className="list-none flex items-center gap-[12px]">
        <Link to={`/members/${profile?.id}/books`}>
          <ToDashboardIcon />
        </Link>
        {didSignIn ? (
          <button onClick={signOut as () => void}>
            <SignOutIcon />
          </button>
        ) : (
          <Link to="/sign-in">
            <SignInIcon />
          </Link>
        )}
      </li>
    </nav>
  );
}
