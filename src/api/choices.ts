import {axiosFlowChart} from "@/api/config";
import {
  CreateChoiceForm,
  DeleteChoiceForm,
  UpdateChoiceDestinationForm,
  UpdateChoiceForm,
} from "@/types/book";

export function createChoice({bookId, pageId, content}: CreateChoiceForm) {
  return axiosFlowChart.post(`/books/${bookId}/pages/${pageId}/choices`, {content});
}

export function updateChoice({bookId, pageId, choiceId, content}: UpdateChoiceForm) {
  return axiosFlowChart.patch(`/books/${bookId}/pages/${pageId}/choices/${choiceId}`, {content});
}

export function updateChoiceDestination({
  bookId,
  pageId,
  choiceId,
  destinationPageId,
}: UpdateChoiceDestinationForm) {
  return axiosFlowChart.patch(`/books/${bookId}/pages/${pageId}/choices/${choiceId}/destination`, {
    destinationPageId,
  });
}

export function deleteChoice({bookId, pageId, choiceId}: DeleteChoiceForm) {
  return axiosFlowChart.delete(`/books/${bookId}/pages/${pageId}/choices/${choiceId}`);
}
