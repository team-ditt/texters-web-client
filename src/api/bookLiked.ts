import {axiosAuthenticated} from "@/api/config";

export function checkBookLiked(memberId: number, bookId: number) {
  return axiosAuthenticated.get(`/members/${memberId}/books/${bookId}/liked`);
}

export function toggleBookLiked(memberId: number, bookId: number) {
  return axiosAuthenticated.put(`members/${memberId}/books/${bookId}/liked`);
}
