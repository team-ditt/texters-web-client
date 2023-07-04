import {LoginPage, OauthKakaoPage, OauthNaverPage} from "@/features/Auth";
import {HomePage} from "@/features/Home";
import {PenNameSettingPage, TermsAndConditionsPage} from "@/features/SignUp";
import {Navigate, Route, Routes} from "react-router-dom";

export default function Router() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/oauth/kakao" element={<OauthKakaoPage />} />
        <Route path="/login/oauth/naver" element={<OauthNaverPage />} />
        <Route path="/sign-up/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/sign-up/pen-name" element={<PenNameSettingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
