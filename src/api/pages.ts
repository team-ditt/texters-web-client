import {axiosAuthenticated, axiosPublic} from "@/api/config";
import {Page, PageView, UpdatePageForm} from "@/types/book";

export function fetchIntroPage(bookId: number) {
  return axiosPublic.get<PageView>(`/books/${bookId}/intro-page`);
}
export function fetchPage(bookId: number, pageId: number) {
  return axiosPublic.get<PageView>(`/books/${bookId}/pages/${pageId}`);
}

export function updatePageInfo({bookId, pageId, ...form}: UpdatePageForm) {
  return axiosAuthenticated.patch<Page>(`/books/${bookId}/pages/${pageId}`, form);
}
