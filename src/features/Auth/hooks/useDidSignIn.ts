import {useAuthStore} from "@/stores";

export default function useDidSignIn() {
  return useAuthStore(state => !!state.accessToken);
}
