import {axiosAuthenticated, axiosPublic} from "@/api/config";
import {
  BookForm,
  BookQuery,
  DashboardBook,
  FlowChart,
  PublishedBook,
  WeeklyMostViewedBook,
} from "@/types/book";
import {Paginated, PaginationQuery} from "@/types/pagination";

export async function createBook({coverImage, title, description}: BookForm) {
  if (!coverImage) return await axiosAuthenticated.post("/books", {title, description});

  const {coverImageId} = await uploadCoverImage(coverImage);
  return await axiosAuthenticated.post("/books", {coverImageId, title, description});
}

export function fetchWeeklyMostViewedBooks() {
  return axiosPublic.get<WeeklyMostViewedBook[]>("/books/weekly-most-viewed", {
    params: {limit: 5},
  });
}

export function fetchPublishedBooks({query, order, page, limit}: BookQuery & PaginationQuery) {
  return axiosPublic.get<Paginated<PublishedBook>>("/books", {params: {query, order, page, limit}});
}

export function fetchPublishedBook(id: number) {
  return axiosPublic.get<PublishedBook>(`/books/${id}`);
}

export function fetchMyBooks({memberId, page, limit}: {memberId: number} & PaginationQuery) {
  return axiosAuthenticated.get<Paginated<DashboardBook>>(`/members/${memberId}/books`, {
    params: {page, limit},
  });
}

export function fetchMyBook(memberId: number, bookId: number) {
  return axiosAuthenticated.get<DashboardBook>(`/members/${memberId}/books/${bookId}`);
}

export function fetchFlowChart(bookId: number) {
  return axiosAuthenticated.get<FlowChart>(`/books/${bookId}/flow-chart`);
}

export async function updateBookInfo(bookId: number, {coverImage, title, description}: BookForm) {
  if (!coverImage) return await axiosAuthenticated.patch(`/books/${bookId}`, {title, description});

  const {coverImageId} = await uploadCoverImage(coverImage);
  return await axiosAuthenticated.patch(`/books/${bookId}`, {coverImageId, title, description});
}

export function publishBook(bookId: number) {
  return axiosAuthenticated.put(`/books/${bookId}/publish`);
}

export function deleteBook(bookId: number) {
  return axiosAuthenticated.delete(`/books/${bookId}`);
}

async function uploadCoverImage(coverImage: File) {
  const form = new FormData();
  form.set("image", coverImage);
  return await axiosAuthenticated.post("/files/books/cover", form);
}
