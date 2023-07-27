import {axiosFlowChart} from "@/api/config";
import {UpdateChoiceForm} from "@/types/book";

export function createChoice({bookId, pageId, content}: UpdateChoiceForm) {
  return axiosFlowChart.post(`/books/${bookId}/pages/${pageId}/choices`, {content});
}

export function deleteChoice(bookId: number, pageId: number, choiceId: number) {
  return axiosFlowChart.delete(`/books/${bookId}/pages/${pageId}/choices/${choiceId}`);
}
