import {api} from "@/api";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";

export default function useSignIn(provider: "KAKAO" | "NAVER" | "GOOGLE") {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (authorizationCode: string) => api.auth.signIn(provider!, authorizationCode),
    onSuccess: () => navigate("/", {replace: true}),
    onError: (error: AxiosError<any>) => {
      const oauthId = error.response?.data.oauthId;
      if (oauthId)
        navigate({
          pathname: "/sign-up",
          search: `oauthId=${oauthId}`,
        });
    },
  });
}
