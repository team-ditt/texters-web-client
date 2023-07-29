import {api} from "@/api";
import {keys} from "@/constants";
import {BookReaderAppBar} from "@/features/Book/components";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";

export default function BookReaderPage() {
  const {bookId} = useParams();
  const {data: book} = useQuery([keys.GET_BOOK, bookId], () => api.books.fetchBook(+bookId!));

  if (!book) return <></>;

  return (
    <div className="mobile-view pt-16">
      <BookReaderAppBar book={book} />
      <div className="flex-1 p-6 text-justify"></div>
    </div>
  );
}
