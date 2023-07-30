import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type BookReaderStoreState = {
  history: {[key: string]: number};
};

type BookReaderStoreAction = {
  recordLastVisitedPageId: (bookId: string, pageId: number) => void;
  findLastVisitedPageId: (bookId: string) => number | undefined;
  hasHistory: (bookId: string) => boolean;
  removeLastVisitedPageId: (bookId: string) => void;
};

const useBookReaderStore = create<BookReaderStoreState & BookReaderStoreAction>()(
  persist(
    (set, get) => ({
      history: {},
      recordLastVisitedPageId: (bookId, pageId) => {
        const {history} = get();
        set({history: {...history, [bookId]: pageId}});
      },
      findLastVisitedPageId: bookId => {
        const {history} = get();
        return history[bookId];
      },
      hasHistory: bookId => {
        const {history} = get();
        return bookId in history;
      },
      removeLastVisitedPageId: bookId => {
        const {history} = get();
        delete history[bookId];
        set({history: {...history}});
      },
    }),
    {
      name: "book-reader-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useBookReaderStore;
