import SignInPage from "@/features/Auth/pages/SignInPage";
import HomePage from "@/features/Home/pages/HomePage";
import {AnimatePresence} from "framer-motion";
import {lazy} from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";

const SignUpPage = lazy(() => import("@/features/SignUp/pages/SignUpPage"));
const BookSearchPage = lazy(() => import("@/features/Book/pages/BookSearchPage"));
const BookInfoPage = lazy(() => import("@/features/Book/pages/BookInfoPage"));
const DashboardPage = lazy(() => import("@/features/Dashboard/pages/DashboardPage"));
const BookInfoFormPage = lazy(() => import("@/features/Book/pages/BookInfoFormPage"));
const BookInfoEditPage = lazy(() => import("@/features/Book/pages/BookInfoEditPage"));
const FlowChartPage = lazy(() => import("@/features/FlowChart/pages/FlowChartPage"));
const PageEditPage = lazy(() => import("@/features/FlowChart/pages/PageEditPage"));
const BookReaderPage = lazy(() => import("@/features/Book/pages/BookReaderPage"));
const BookDemoReaderPage = lazy(() => import("@/features/Book/pages/BookDemoReaderPage"));
const NotFoundPage = lazy(() => import("@/features/Error/pages/NotFoundPage"));

export function Router() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/books" element={<BookSearchPage />} />
        <Route path="/books/:bookId" element={<BookInfoPage />} />
        <Route path="/books/:bookId/read" element={<BookReaderPage />} />
        <Route path="/studio/dashboard" element={<DashboardPage />} />
        <Route path="/studio/books/info" element={<BookInfoFormPage />} />
        <Route path="/studio/books/:bookId" element={<BookInfoEditPage />} />
        <Route path="/studio/books/:bookId/flow-chart" element={<FlowChartPage />} />
        <Route path="/studio/books/:bookId/flow-chart/pages/:pageId" element={<PageEditPage />} />
        <Route path="/studio/books/:bookId/read" element={<BookDemoReaderPage />} />
        <Route path="/error/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/error/not-found" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
