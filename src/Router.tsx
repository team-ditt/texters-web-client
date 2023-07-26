import {SignInPage} from "@/features/Auth/pages";
import {
  BookInfoEditPage,
  BookInfoFormPage,
  BookInfoPage,
  BookSearchPage,
} from "@/features/Book/pages";
import {DashboardPage} from "@/features/Dashboard/pages";
import FlowChartPage from "@/features/FlowChart/pages/FlowChartPage";
import {HomePage} from "@/features/Home/pages";
import {SignUpPage} from "@/features/SignUp/pages";
import {useAuthStore} from "@/stores";
import {AnimatePresence} from "framer-motion";
import {useEffect} from "react";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";

export function Router() {
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
        <Route path="/books" element={<BookSearchPage />} />
        <Route path="/books/:bookId" element={<BookInfoPage />} />
        <Route path="/studio/dashboard" element={<DashboardPage />} />
        <Route path="/studio/books/info" element={<BookInfoFormPage />} />
        <Route path="/studio/books/:bookId" element={<BookInfoEditPage />} />
        <Route path="/studio/books/:bookId/flow-chart" element={<FlowChartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
