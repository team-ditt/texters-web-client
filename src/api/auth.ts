import {axiosAuthenticated, axiosPublic} from "@/api/config";
import {SignInResponse, SignUpForm} from "@/types/auth";

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
