import {axiosPublic} from "@/api/config";
import {WeeklyMostViewedBook} from "@/types/book";

export function fetchWeeklyMostViewedBooks() {
  return axiosPublic.get<WeeklyMostViewedBook[]>("/books/weekly-most-viewed", {
    params: {
      limit: 5,
    },
  });
}
