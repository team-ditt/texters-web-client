import {Author} from "@/types/member";

export type BookStatistics = {
  viewed: number;
  liked: number;
  commentsCount: number;
};

export type Book = {
  id: number;
  title: string;
  description: string;
  // coverImageUrl: string | null;
  // author: Author;
};

export type WeeklyMostViewedBook = Book & {
  publishedAt: string;
  weeklyViewed: number;
};

export type DashboardBook = Book; // &
// BookStatistics & {
//   createdAt: string;
//   updatedAt: string;
//   isPublished: boolean;
//   canUpdate: boolean;
// };

export type PublishedBook = Book &
  BookStatistics & {
    publishedAt: string;
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

export type FlowChart = Omit<Book, "viewed" | "liked" | "coverImageUrl"> & {
  // createdAt: string;
  // updatedAt: string;
  lanes: Lane[];
};

export type Lane = {
  id: number;
  bookId: number;
  order: number;
  pages: Page[];
};

export type CreateLaneForm = {
  bookId: number;
  order: number;
};

export type DeleteLaneForm = {
  bookId: number;
  laneId: number;
};

export type Page = {
  id: number;
  bookId: number;
  laneId: number;
  order: number;
  title: string;
  content: string | null;
  // createdAt: string;
  // updatedAt: string;
  choices: Choice[];
  isIntro: boolean;
};

export type PageView = Page & {
  isEnding: boolean;
};

export type CreatePageForm = {
  bookId: number;
  laneId: number;
  title: string;
  order: number;
};

export type UpdatePageForm = {
  bookId: number;
  pageId: number;
  title?: string;
  content?: string | null;
};

export type UpdatePageOrderForm = {
  bookId: number;
  pageId: number;
  laneId: number;
  order: number;
};

export type DeletePageForm = {
  bookId: number;
  pageId: number;
};

export type Choice = {
  id: number;
  sourcePageId: number;
  destinationPageId: number | null;
  order: number;
  content: string;
};

export type CreateChoiceForm = {
  bookId: number;
  pageId: number;
  content: string;
};

export type UpdateChoiceForm = CreateChoiceForm & {choiceId: number};

export type UpdateChoiceOrderForm = {
  bookId: number;
  pageId: number;
  choiceId: number;
  order: number;
};

export type UpdateChoiceDestinationForm = {
  bookId: number;
  pageId: number;
  choiceId: number;
  destinationPageId: number | null;
};

export type DeleteChoiceForm = {bookId: number; pageId: number; choiceId: number};
