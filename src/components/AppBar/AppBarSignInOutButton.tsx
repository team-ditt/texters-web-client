import {useSignOut} from "@/features/Auth/hooks";
import {useAuthStore} from "@/stores";
import {ReactComponent as SignInIcon} from "assets/icons/sign-in.svg";
import {ReactComponent as SignOutIcon} from "assets/icons/sign-out.svg";
import {Link} from "react-router-dom";

export default function AppBarSignInOutButton() {
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const {mutate: signOut} = useSignOut();

  const onSignOut = () => {
    if (confirm("로그아웃하시겠어요?")) signOut();
  };

  if (didSignIn)
    return (
      <button className="p-1.5" onClick={onSignOut}>
        <SignOutIcon />
      </button>
    );

  return (
    <Link className="p-1.5" to="/sign-in">
      <SignInIcon />
    </Link>
  );
}
