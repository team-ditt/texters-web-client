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

export type DashboardBook = Book & {
  canPublish: boolean;
  publishErrors: string[];
};

export type BookQuery = {
  query?: string;
  order: BookQueryOrderType;
};

export type BookQueryOrderType = "viewed" | "liked" | "published-date";

export type BookForm = {
  coverImage: File | null;
  title: string;
  description: string;
};

export type FlowChart = Omit<Book, "viewed" | "liked" | "coverImageUrl"> & {lanes: Lane[]};

export type Lane = {
  id: number;
  bookId: number;
  order: number;
  pages: Page[];
};

export type Page = {
  id: number;
  bookId: number;
  laneId: number;
  order: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  choices: Choice[];
};

export type UpdatePageForm = {
  bookId: number;
  pageId: number;
  title?: string;
  content?: string | null;
};

export type Choice = {
  id: number;
  sourcePageId: number;
  destinationPageId: number | null;
  order: number;
  content: string;
};

export type UpdateChoiceForm = {
  bookId: number;
  pageId: number;
  content: string;
};
