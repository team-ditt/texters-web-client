import AdminStatisticsPage from "@/features/Admin/pages/AdminStatisticsPage";
import SignInPage from "@/features/Auth/pages/SignInPage";
import HomePage from "@/features/Home/pages/HomePage";
import OfficialDocumentPage from "@/features/OfficialDocuments/pages/OfficialDocumentPage";
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
const CommentPage = lazy(() => import("@/features/Comment/pages/CommentPage"));
const BoardThreadListPage = lazy(() => import("@/features/Board/pages/BoardThreadListPage"));
const BoardThreadFormPage = lazy(() => import("@/features/Board/pages/BoardThreadFormPage"));
const BoardThreadPage = lazy(() => import("@/features/Board/pages/BoardThreadPage"));
const BoardThreadEditPage = lazy(() => import("@/features/Board/pages/BoardThreadEditPage"));
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
        <Route path="/books/:bookId/comments" element={<CommentPage />} />
        <Route path="/studio/dashboard" element={<DashboardPage />} />
        <Route path="/studio/books/info" element={<BookInfoFormPage />} />
        <Route path="/studio/books/:bookId" element={<BookInfoEditPage />} />
        <Route path="/studio/books/:bookId/editor" element={<FlowChartPage />} />
        <Route path="/studio/books/:bookId/editor/pages/:pageId" element={<PageEditPage />} />
        <Route path="/studio/books/:bookId/read" element={<BookDemoReaderPage />} />
        <Route path="/boards/:boardId/threads" element={<BoardThreadListPage />} />
        <Route path="/boards/:boardId/threads/new" element={<BoardThreadFormPage />} />
        <Route path="/boards/:boardId/threads/:threadId" element={<BoardThreadPage />} />
        <Route path="/boards/:boardId/threads/:threadId/edit" element={<BoardThreadEditPage />} />
        <Route
          path="/terms-and-conditions"
          element={<OfficialDocumentPage type="terms and conditions" />}
        />
        <Route path="/privacy-policy" element={<OfficialDocumentPage type="privacy policy" />} />
        <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
        <Route path="/error/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/error/not-found" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
