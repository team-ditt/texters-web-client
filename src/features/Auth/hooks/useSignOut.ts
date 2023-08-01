import {api} from "@/api";
import {useAuthStore} from "@/stores";
import {useMutation} from "@tanstack/react-query";

export default function useSignOut() {
  const {removeToken} = useAuthStore();

  return useMutation({
    mutationFn: api.auth.signOut,
    onSuccess: () => {
      removeToken();
      window.location.href = "/";
    },
    onError: () => {
      removeToken();
      window.location.href = "/";
    },
  });
}
