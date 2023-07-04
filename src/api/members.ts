import {axiosPublic} from "@/api/config";

export function isUniquePenName(penName: string) {
  return axiosPublic.get<void>(`/members/pen-name/${penName}/unique`);
}
