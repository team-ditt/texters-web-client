import {axiosAuthenticated, axiosPublic} from "@/api/config";

type MemberRole = "ROLE_USER" | "ROLE_ADMIN";

type Profile = {
  id: number;
  oauthId: string;
  penName: string;
  role: MemberRole;
  createdAt: Date;
  modifiedAt: Date;
};

export function isUniquePenName(penName: string) {
  return axiosPublic.get<void>(`/members/pen-name/${penName}/unique`);
}

export function fetchProfile() {
  return axiosAuthenticated.get<Profile>("/members/profile");
}
