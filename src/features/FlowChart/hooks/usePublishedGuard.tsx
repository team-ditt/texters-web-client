import {api} from "@/api";
import {Modal} from "@/components";
import {keys} from "@/constants";
import {useProfile} from "@/features/Member/hooks";
import {useModal} from "@/hooks";
import {TextersError, TextersErrorCode} from "@/types/error";
import {useQuery} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";

export default function usePublishedGuard(bookId: number) {
  const navigate = useNavigate();
  const {isOpen, openModal, closeModal} = useModal();

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

  const onGoFlowChart = useMemo(
    () => () => {
      closeModal();
      navigate(`/studio/books/${bookId}/flow-chart`, {replace: true});
    },
    [bookId],
  );

  const PublishedBookAlert = useMemo(
    () => () => (
      <Modal.Alert
        isOpen={isOpen}
        title="공개된 작품이에요"
        message="이미 공개된 작품은 수정할 수 없어요!"
        onRequestClose={onGoFlowChart}
      />
    ),
    [isOpen, onGoFlowChart],
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

  return {book, PublishedBookAlert};
}
