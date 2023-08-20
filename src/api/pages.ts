import {axiosAuthenticated, axiosPublic} from "@/api/config";
import {
  CreatePageForm,
  DeletePageForm,
  Page,
  PageView,
  UpdatePageForm,
  UpdatePageOrderForm,
} from "@/types/book";

export function createPage({bookId, laneId, ...form}: CreatePageForm) {
  return axiosAuthenticated.post(`/books/${bookId}/lanes/${laneId}/pages`, form);
}

export function fetchDashboardIntroPage(memberId: number, bookId: number) {
  return axiosAuthenticated.get<PageView>(`/members/${memberId}/books/${bookId}/intro-page`);
}

export function fetchDashboardPage(memberId: number, bookId: number, pageId: number) {
  return axiosAuthenticated.get<PageView>(`/members/${memberId}/books/${bookId}/pages/${pageId}`);
}

export function fetchIntroPage(bookId: number) {
  return axiosPublic.get<PageView>(`/books/${bookId}/intro-page`);
}

export function fetchPage(bookId: number, pageId: number) {
  return axiosPublic.get<PageView>(`/books/${bookId}/pages/${pageId}`);
}

export function updatePageInfo({bookId, pageId, ...form}: UpdatePageForm) {
  return axiosAuthenticated.patch<Page>(`/books/${bookId}/pages/${pageId}`, form);
}

export function updatePageOrder({bookId, pageId, ...form}: UpdatePageOrderForm) {
  return axiosAuthenticated.patch<Page>(`/books/${bookId}/pages/${pageId}/lane`, form);
}

export function deletePage({bookId, pageId}: DeletePageForm) {
  return axiosAuthenticated.delete(`/books/${bookId}/pages/${pageId}`);
}
