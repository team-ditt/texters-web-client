import {axiosAuthenticated, axiosPublic} from "@/api/config";
import {Profile} from "@/types/member";

export function isUniquePenName(penName: string) {
  return axiosPublic.get<void>(`/members/pen-name/${penName}/unique`);
}

export function fetchProfile() {
  return axiosAuthenticated.get<Profile>("/members/profile");
}
