import {useAuthStore} from "@/stores";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function useAuthGuard() {
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (didSignIn) return;
    if (confirm("로그인이 필요한 서비스에요! 로그인하시겠어요?"))
      return navigate("/sign-in", {replace: true});
    return navigate("/", {replace: true});
  }, []);
}
