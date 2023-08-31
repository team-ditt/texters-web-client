import {axiosAuthenticated} from "@/api/config";

type Statistics = {
  day: string;
  count: number;
};

export function fetchNewUsersStatistics(days: number = 7) {
  return axiosAuthenticated.get<Statistics[]>("/admin/statistics/new-users", {params: {days}});
}

export function fetchNewBooksStatistics(days: number = 7) {
  return axiosAuthenticated.get<Statistics[]>("/admin/statistics/new-books", {params: {days}});
}
