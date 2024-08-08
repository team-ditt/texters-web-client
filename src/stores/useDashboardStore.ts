import {Book} from "@/types/book";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import useFlowChartListStore from "./useFlowChartListStore";

type DashboardStoreState = {
  books: Book[];
};

type DashboardStoreAction = {
  createBook: (book: Omit<Book, "id">) => Book;
  updateBook: (book: Book) => Book;
  removeBook: (bookId: number) => void;
};

const useDashboardStore = create<DashboardStoreState & DashboardStoreAction>()(
  persist(
    (set, get) => ({
      books: [],
      createBook: (book: Omit<Book, "id">) => {
        const bookId = get().books.reduce((a, b) => Math.max(a, b.id), 0) + 1;
        const completeBook = {...book, id: bookId};
        set({books: [...get().books, completeBook]});
        const laneId = useFlowChartListStore.getState().getNextId();
        const pageId = useFlowChartListStore.getState().getNextId();
        useFlowChartListStore.getState().createFlowChart({
          ...completeBook,
          lanes: [
            {
              id: laneId,
              bookId: bookId,
              order: 0,
              pages: [
                {
                  id: pageId,
                  bookId: bookId,
                  laneId: laneId,
                  order: 0,
                  title: "페이지 제목을 입력해주세요",
                  content: "",
                  choices: [],
                  isIntro: true,
                },
              ],
            },
          ],
        });
        return completeBook;
      },
      updateBook: (book: Book) => {
        set({books: get().books.map(b => (b.id === book.id ? book : b))});
        const flowChart = useFlowChartListStore.getState().getFlowChart(book.id);
        useFlowChartListStore.getState().updateFlowChart({
          ...flowChart,
          title: book.title,
          description: book.description,
        });
        return book;
      },
      removeBook: (bookId: number) => {
        set({books: get().books.filter(b => b.id !== bookId)});
        useFlowChartListStore.getState().removeFlowChart(bookId);
      },
    }),
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useDashboardStore;
