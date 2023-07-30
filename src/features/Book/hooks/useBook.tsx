import {api} from "@/api";
import {Modal} from "@/components";
import {keys} from "@/constants";
import {useQuery} from "@tanstack/react-query";

export default function useBook(bookId: number) {
  const {data: book, isError} = useQuery(
    [keys.GET_BOOK, bookId],
    () => api.books.fetchBook(+bookId!),
    {
      enabled: !!bookId,
    },
  );

  const onGoHome = () => {
    window.location.href = "/";
  };

  const BookNotFoundAlert = () => (
    <Modal.Alert
      isOpen={isError}
      title="작품을 찾을 수 없어요"
      message="홈 화면으로 이동할게요!"
      onRequestClose={onGoHome}
    />
  );

  return {book, BookNotFoundAlert};
}
