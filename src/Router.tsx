import {SignInPage} from "@/features/Auth";
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
      navigate("/sign-in");
    }
  }, [isSessionExpired]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}
