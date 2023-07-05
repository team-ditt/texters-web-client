import {axiosAuthenticated, axiosPublic} from "@/api/config";

type SignInResponse = {
  responseType: "signIn" | "signUp";
  oauthId?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
};

type SignUpForm = {
  oauthId: string;
  penName: string;
};

export function signIn(provider: "KAKAO" | "NAVER" | "GOOGLE", authorizationCode: string) {
  return axiosPublic.post<SignInResponse>("/auth/sign-in", {provider, authorizationCode});
}

export function signUp(form: SignUpForm) {
  return axiosPublic.post("/auth/sign-up", form);
}

export function reissueTokens() {
  return axiosAuthenticated.post("/auth/token-refresh");
}

export function signOut() {
  return axiosAuthenticated.post("/auth/sign-out");
}
