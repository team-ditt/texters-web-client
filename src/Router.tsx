import SignInPage from "@/features/Auth/pages/SignInPage";
import HomePage from "@/features/Home/pages/HomePage";
import {useAuthStore} from "@/stores";
import {AnimatePresence} from "framer-motion";
import {lazy, useEffect} from "react";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";

const SignUpPage = lazy(() => import("@/features/SignUp/pages/SignUpPage"));
const BookSearchPage = lazy(() => import("@/features/Book/pages/BookSearchPage"));
const BookInfoPage = lazy(() => import("@/features/Book/pages/BookInfoPage"));
const DashboardPage = lazy(() => import("@/features/Dashboard/pages/DashboardPage"));
const BookInfoFormPage = lazy(() => import("@/features/Book/pages/BookInfoFormPage"));
const BookInfoEditPage = lazy(() => import("@/features/Book/pages/BookInfoEditPage"));
const FlowChartPage = lazy(() => import("@/features/FlowChart/pages/FlowChartPage"));
const PageEditPage = lazy(() => import("@/features/FlowChart/pages/PageEditPage"));

export function Router() {
  const location = useLocation();
  const navigate = useNavigate();
  const {isSessionExpired, resolveExpiredSession} = useAuthStore();

  useEffect(() => {
    if (isSessionExpired) {
      resolveExpiredSession();
      alert("세션이 만료되었어요. 다시 로그인하시겠어요?");
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
        <Route path="/studio/books/:bookId/flow-chart/pages/:pageId" element={<PageEditPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
