import {Author} from "@/types/member";

export type BookStatus = "DRAFT" | "PUBLISHED";

export type Book = {
  id: number;
  title: string;
  description: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
  viewed: number;
  liked: number;
  coverImageUrl: string | null;
  author: Author;
};

export type WeeklyMostViewedBook = Book & {
  weeklyViewed: number;
};

export type BookQuery = {
  query?: string;
  order: BookQueryOrderType;
};

export type BookQueryOrderType = "viewed" | "liked" | "published-date";
