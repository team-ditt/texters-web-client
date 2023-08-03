import {api} from "@/api";
import {keys} from "@/constants";
import {TextersError, TextersErrorCode} from "@/types/error";
import {useQuery} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function useBookInfo(bookId: number) {
  const navigate = useNavigate();
  const {data: book, error} = useQuery(
    [keys.GET_BOOK, bookId],
    () => api.books.fetchBook(+bookId!),
    {
      enabled: !!bookId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  useEffect(() => {
    if (
      (error as AxiosError<TextersError>)?.response?.data.code === TextersErrorCode.BOOK_NOT_FOUND
    )
      navigate("/error/not-found");
  }, [error]);

  return {book};
}
