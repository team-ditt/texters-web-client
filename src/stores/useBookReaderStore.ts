import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type BookHistory = {
  pageId: number;
  isIntro?: boolean;
  isEnding?: boolean;
};

type BookReaderStoreState = {
  history: {[key: string]: BookHistory[]};
};

type BookReaderStoreAction = {
  recordHistory: (bookId: string, bookHistory: BookHistory) => void;
  popHistory: (bookId: string) => void;
  findLastHistory: (bookId: string) => BookHistory | undefined;
  hasHistory: (bookId: string) => boolean;
  canGoBack: (bookId: string) => boolean;
  resetHistory: (bookId: string) => void;
};

const useBookReaderStore = create<BookReaderStoreState & BookReaderStoreAction>()(
  persist(
    (set, get) => ({
      history: {},
      recordHistory: (bookId, bookHistory) => {
        const {history} = get();
        const queue: BookHistory[] = history[bookId] ?? [];
        queue.push(bookHistory);
        set({history: {...history, [bookId]: queue}});
      },
      popHistory: bookId => {
        const {history} = get();
        const queue: BookHistory[] = history[bookId] ?? [];
        queue.pop();
        set({history: {...history, [bookId]: queue}});
      },
      findLastHistory: bookId => {
        const {history} = get();
        const queue = history[bookId];
        return queue?.[queue?.length - 1];
      },
      hasHistory: bookId => {
        const {history, findLastHistory} = get();
        const lastHistory = findLastHistory(bookId);
        return history[bookId]?.length > 0 && !lastHistory?.isIntro && !lastHistory?.isEnding;
      },
      canGoBack: bookId => {
        const {history} = get();
        return history[bookId]?.length > 1;
      },
      resetHistory: bookId => {
        const {history} = get();
        delete history[bookId];
        set({history: {...history}});
      },
    }),
    {
      name: "book-reader-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export default useBookReaderStore;
