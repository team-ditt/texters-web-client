export type Comment = {
  id: number;
  commenterName: string;
  content: string;
  isAuthor: boolean;
  isSpoiler: boolean;
  isCommenter: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CommentForm = {
  bookId: number;
  content: string;
  isSpoiler: boolean;
};
