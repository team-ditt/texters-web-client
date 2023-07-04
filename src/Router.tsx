import {LoginPage, OauthGooglePage, OauthKakaoPage, OauthNaverPage} from "@/features/Auth";
import {HomePage} from "@/features/Home";
import {PenNameSettingPage, TermsAndConditionsPage} from "@/features/SignUp";
import {useAuthStore} from "@/stores";
import {useEffect} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";

export default function Router() {
  const navigate = useNavigate();
  const {isSessionExpired, resolveExpiredSession} = useAuthStore();

  useEffect(() => {
    if (isSessionExpired) {
      resolveExpiredSession();
      alert("세션이 만료되었습니다.");
      navigate("/login");
    }
  }, [isSessionExpired]);

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/oauth/kakao" element={<OauthKakaoPage />} />
      <Route path="/login/oauth/naver" element={<OauthNaverPage />} />
      <Route path="/login/oauth/google" element={<OauthGooglePage />} />
      <Route path="/sign-up/terms-and-conditions" element={<TermsAndConditionsPage />} />
      <Route path="/sign-up/pen-name" element={<PenNameSettingPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
