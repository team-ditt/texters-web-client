import {api} from "@/api";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

export default function useSignIn(provider: "KAKAO" | "NAVER" | "GOOGLE") {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (authorizationCode: string) => api.auth.signIn(provider, authorizationCode),
    onSuccess: response => {
      if (response.responseType === "signUp") {
        return navigate({
          pathname: "/sign-up/terms-and-conditions",
          search: `oauthId=${response.oauthId}`,
        });
      }
      navigate("/");
    },
  });
}
