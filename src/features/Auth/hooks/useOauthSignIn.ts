import useSignIn from "@/features/Auth/hooks/useSignIn";
import {useEffect, useMemo} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

const KAKAO_LOGIN_URI =
  "https://kauth.kakao.com/oauth/authorize?" +
  new URLSearchParams([
    ["client_id", import.meta.env.VITE_KAKAO_CLIENT_ID],
    ["redirect_uri", `${import.meta.env.VITE_CLIENT_URL}/sign-in?oauth=kakao`],
    ["response_type", "code"],
  ]).toString();
const NAVER_LOGIN_URI =
  "https://nid.naver.com/oauth2.0/authorize?" +
  new URLSearchParams([
    ["client_id", import.meta.env.VITE_NAVER_CLIENT_ID],
    ["redirect_uri", `${import.meta.env.VITE_CLIENT_URL}/sign-in?oauth=naver`],
    ["response_type", "code"],
  ]).toString();
const GOOGLE_LOGIN_URI =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams([
    ["client_id", import.meta.env.VITE_GOOGLE_CLIENT_ID],
    ["redirect_uri", `${import.meta.env.VITE_CLIENT_URL}/sign-in?oauth=google`],
    ["response_type", "code"],
    ["scope", "https://www.googleapis.com/auth/userinfo.email"],
  ]).toString();

export default function useOauthSignIn() {
  const [searchParams] = useSearchParams();
  const oauthProvider = useMemo(() => searchParams.get("oauth"), [searchParams]);

  const navigate = useNavigate();
  const {mutate: signIn} = useSignIn(oauthProvider?.toUpperCase() as "KAKAO" | "NAVER" | "GOOGLE");

  useEffect(() => {
    if (!oauthProvider) return;

    const authorizationCode = searchParams.get("code");
    if (!authorizationCode) return navigate("/");
    signIn(authorizationCode);
  }, [oauthProvider]);

  return {KAKAO_LOGIN_URI, NAVER_LOGIN_URI, GOOGLE_LOGIN_URI, isSigningIn: !!oauthProvider};
}
