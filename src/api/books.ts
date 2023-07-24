import {axiosAuthenticated, axiosPublic} from "@/api/config";
import {Book, BookQuery, DashboardBook, WeeklyMostViewedBook} from "@/types/book";
import {Paginated, PaginationQuery} from "@/types/pagination";

export function fetchWeeklyMostViewedBooks() {
  return axiosPublic.get<WeeklyMostViewedBook[]>("/books/weekly-most-viewed", {
    params: {limit: 5},
  });
}

export function fetchBooks({query, order, page, limit}: BookQuery & PaginationQuery) {
  return axiosPublic.get<Paginated<Book>>("/books", {params: {query, order, page, limit}});
}

export function fetchBook(id: number) {
  return axiosPublic.get<Book>(`/books/${id}`);
}

export function fetchMyBooks({memberId, page, limit}: {memberId: number} & PaginationQuery) {
  return axiosAuthenticated.get<Paginated<DashboardBook>>(`/members/${memberId}/books`, {
    params: {page, limit},
  });
}

export function publishBook(bookId: number) {
  return axiosAuthenticated.put(`books/${bookId}/publish`);
}

export function deleteBook(bookId: number) {
  return axiosAuthenticated.delete(`books/${bookId}`);
}
