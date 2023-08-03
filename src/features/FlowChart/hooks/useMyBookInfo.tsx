import {api} from "@/api";
import {Modal} from "@/components";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {useModal} from "@/hooks";
import {TextersError, TextersErrorCode} from "@/types/error";
import {useQuery} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function useMyBookInfo(bookId: number) {
  const didSignIn = useDidSignIn();
  const navigate = useNavigate();
  const {isOpen, openModal, closeModal} = useModal();

  const {data: profile} = useQuery([keys.GET_MY_PROFILE], api.members.fetchProfile, {
    enabled: didSignIn,
  });
  const {
    data: book,
    error,
    isError,
  } = useQuery([keys.GET_MY_BOOK, bookId], () => api.books.fetchMyBook(profile!.id, +bookId!), {
    enabled: !!profile?.id,
    retry: false,
  });

  const onClose = () => {
    window.location.href = "/studio/dashboard";
  };
  const onGoDashboard = () => {
    closeModal();
    navigate("/studio/dashboard", {replace: true});
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
  const PublishedBookAlert = () => (
    <Modal.Alert
      isOpen={isOpen}
      title="공개된 작품이에요"
      message="이미 공개된 작품은 수정할 수 없어요!"
      onRequestClose={onGoDashboard}
    />
  );

  useEffect(() => {
    if (book?.status === "PUBLISHED") openModal();
  }, [book]);
  useEffect(() => {
    if (
      (error as AxiosError<TextersError>)?.response?.data.code === TextersErrorCode.BOOK_NOT_FOUND
    )
      navigate("/error/not-found");
  }, [error]);

  return {book, NotAuthorAlert, PublishedBookAlert};
}
