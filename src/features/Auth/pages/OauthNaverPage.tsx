import {SpinningLoader} from "@/components";
import {useSignIn} from "@/features/Auth/hooks";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function OauthNaverPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {mutate: signIn} = useSignIn("NAVER");

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
