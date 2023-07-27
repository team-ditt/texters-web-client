import {axiosPublic} from "@/api/config";
import {Page} from "@/types/book";

export function fetchPage(bookId: number, pageId: number) {
  return axiosPublic.get<Page>(`/books/${bookId}/pages/${pageId}`);
}
