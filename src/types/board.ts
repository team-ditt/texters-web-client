import {MemberRole} from "@/types/member";

export type Thread = {
  id: number;
  authorId: number | null;
  authorName: string;
  authorRole: MemberRole;
  title: string;
  content: string;
  isAuthor: boolean;
  isHidden: boolean;
  isFixed: boolean;
  liked: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ThreadQuery = {
  type: ThreadQueryFixedType;
  order: ThreadQueryOrderType;
};
export type ThreadQueryFixedType = "all" | "fixed";
export type ThreadQueryOrderType = "created-at" | "liked";

export type PasswordForm = {password?: string};

export type CreateThreadForm = {
  title: string;
  content: string;
  isHidden: boolean;
  isFixed: boolean;
} & PasswordForm;

export type UpdateThreadForm = {
  title: string;
  content: string;
  isFixed: boolean;
} & PasswordForm;

export type ThreadComment = {
  id: number;
  commenterName: string;
  commenterRole: MemberRole;
  content: string;
  isThreadAuthor: boolean;
  isCommenter: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ThreadCommentForm = {
  content: string;
} & PasswordForm;
