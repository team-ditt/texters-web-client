import {api} from "@/api";
import {Modal} from "@/components";
import {keys} from "@/constants";
import {useProfile} from "@/features/Member/hooks";
import {TextersError, TextersErrorCode} from "@/types/error";
import {useQuery} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function useMyBookInfo(bookId: number) {
  const navigate = useNavigate();

  const {profile} = useProfile();
  const {
    data: book,
    error,
    isError,
  } = useQuery([keys.GET_MY_BOOK, bookId], () => api.books.fetchMyBook(profile!.id, +bookId!), {
    enabled: !!profile?.id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const onClose = () => {
    window.location.href = "/studio/dashboard";
  };

  const NotAuthorAlert = () => (
    <Modal.Alert
      isOpen={isError}
      title="작가 본인이 맞으신가요?"
      message="작품 수정은 작가 본인만 가능해요!"
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    />
  );

  useEffect(() => {
    if (
      (error as AxiosError<TextersError>)?.response?.data.code === TextersErrorCode.BOOK_NOT_FOUND
    )
      navigate("/error/not-found");
  }, [error]);

  return {book, NotAuthorAlert};
}
