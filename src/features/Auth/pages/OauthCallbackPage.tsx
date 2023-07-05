import {SpinningLoader} from "@/components";
import {useSignIn} from "@/features/Auth/hooks";
import {useEffect, useMemo} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";

export default function OauthGooglePage() {
  const location = useLocation();
  const oauthProvider = useMemo(() => {
    if (location.pathname.endsWith("kakao")) return "KAKAO";
    if (location.pathname.endsWith("naver")) return "NAVER";
    return "GOOGLE";
  }, [location]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {mutate: signIn} = useSignIn(oauthProvider);

  useEffect(() => {
    const authorizationCode = searchParams.get("code");
    if (!authorizationCode) return navigate("/");
    signIn(authorizationCode);
  }, []);

  return (
    <div className="page-container">
      소셜로그인 중입니다...
      <SpinningLoader color="#b8b8b8" />
    </div>
  );
}
