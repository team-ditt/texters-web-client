import {axiosAuthenticated} from "@/api/config";
import {Comment, CommentForm} from "@/types/comment";
import {Paginated, PaginationQuery} from "@/types/pagination";

export function createComment({bookId, ...form}: CommentForm) {
  return axiosAuthenticated.post(`/books/${bookId}/comments`, form);
}

export function fetchComments({bookId, page, limit}: {bookId: number} & PaginationQuery) {
  return axiosAuthenticated.get<Paginated<Comment>>(`/books/${bookId}/comments`, {
    params: {page, limit},
  });
}

export function deleteComment(commentId: number) {
  return axiosAuthenticated.delete(`/comments/${commentId}`);
}
