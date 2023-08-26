import {getAxiosInstance} from "@/api/config";
import {
  CreateThreadForm,
  Thread,
  ThreadComment,
  ThreadCommentForm,
  ThreadQuery,
  UpdateThreadForm,
} from "@/types/board";
import {Paginated, PaginationQuery} from "@/types/pagination";

export function createThread(boardId: string, form: CreateThreadForm) {
  return getAxiosInstance().post(`/boards/${boardId}/threads`, form);
}

export function fetchThreads(
  boardId: string,
  {type, order, page, limit}: ThreadQuery & PaginationQuery,
) {
  return getAxiosInstance().get<Paginated<Thread>>(`/boards/${boardId}/threads`, {
    params: {type, order, page, limit},
  });
}

export function fetchThread(boardId: string, threadId: number) {
  return getAxiosInstance().get<Thread>(`/boards/${boardId}/threads/${threadId}`);
}

export function authThread(boardId: string, threadId: number, password?: string) {
  return getAxiosInstance(password).post(`/boards/${boardId}/threads/${threadId}/authorization`, {
    password,
  });
}

export function updateThread(boardId: string, threadId: number, form: UpdateThreadForm) {
  return getAxiosInstance(form.password).patch(`/boards/${boardId}/threads/${threadId}`, form);
}

export function deleteThread(boardId: string, threadId: number, password?: string) {
  return getAxiosInstance(password).delete(`/boards/${boardId}/threads/${threadId}`, {
    data: {password},
  });
}

export function createComment(boardId: string, threadId: number, form: ThreadCommentForm) {
  return getAxiosInstance().post(`/boards/${boardId}/threads/${threadId}/comments`, form);
}

export function fetchComments(boardId: string, threadId: number, {page, limit}: PaginationQuery) {
  return getAxiosInstance().get<Paginated<ThreadComment>>(
    `/boards/${boardId}/threads/${threadId}/comments`,
    {
      params: {page, limit},
    },
  );
}

export function deleteComment(
  boardId: string,
  threadId: number,
  threadCommentId: number,
  password?: string,
) {
  return getAxiosInstance(password).delete(
    `/boards/${boardId}/threads/${threadId}/comments/${threadCommentId}`,
    {
      data: {password},
    },
  );
}

export function likeThread(boardId: string, threadId: number) {
  return getAxiosInstance().post(`/boards/${boardId}/threads/${threadId}/liked`);
}
