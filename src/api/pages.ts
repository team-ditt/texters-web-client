import {axiosAuthenticated, axiosPublic} from "@/api/config";
import {Page, UpdatePageForm} from "@/types/book";

export function fetchPage(bookId: number, pageId: number) {
  return axiosPublic.get<Page>(`/books/${bookId}/pages/${pageId}`);
}

export function updatePageInfo({bookId, pageId, ...form}: UpdatePageForm) {
  return axiosAuthenticated.patch<Page>(`/books/${bookId}/pages/${pageId}`, form);
}
