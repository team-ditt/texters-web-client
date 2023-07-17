import {LoginPage} from "@/features/Auth";
import {HomePage} from "@/features/Home";
import {SignUpPage} from "@/features/SignUp";
import {useAuthStore} from "@/stores";
import {AnimatePresence} from "framer-motion";
import {useEffect} from "react";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";

export default function Router() {
  const location = useLocation();
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
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}
