export type MemberRole = "ROLE_USER" | "ROLE_ADMIN";

export type Profile = {
  id: number;
  oauthId: string;
  penName: string;
  role: MemberRole;
  createdAt: string;
  modifiedAt: string;
};

export type Author = {
  id: number;
  penName: string;
  joinedAt: string;
};
