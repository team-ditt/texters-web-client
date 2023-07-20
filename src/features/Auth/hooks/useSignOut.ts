import {api} from "@/api";
import {useAuthStore} from "@/stores";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

export default function useSignOut() {
  const navigate = useNavigate();
  const {removeToken} = useAuthStore();

  return useMutation({
    mutationFn: api.auth.signOut,
    onSuccess: () => {
      navigate("/", {replace: true});
      removeToken();
      window.location.reload();
    },
    onError: () => {
      navigate("/");
      removeToken();
      window.location.reload();
    },
  });
}
