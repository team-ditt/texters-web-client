import {axiosAuthenticated} from "@/api/config";
import {CreateLaneForm, DeleteLaneForm} from "@/types/book";

export function createLane({bookId, ...form}: CreateLaneForm) {
  return axiosAuthenticated.post(`/books/${bookId}/lanes`, form);
}

export function deleteLane({bookId, laneId}: DeleteLaneForm) {
  return axiosAuthenticated.delete(`/books/${bookId}/lanes/${laneId}`);
}
