import {api} from "@/api";
import {SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {
  BookCoverImageUploader,
  BookDescriptionTextarea,
  BookTitleInput,
} from "@/features/Book/components";
import {useMyBookInfo} from "@/features/FlowChart/hooks";
import {useAuthGuard, useTextInput} from "@/hooks";
import {Validator} from "@/utils";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AnimatePresence, motion} from "framer-motion";
import {ChangeEventHandler, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function BookInfoEditPage() {
  const {bookId} = useParams();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const {
    value: title,
    isValid,
    setValue: setTitle,
    onInput: onInputTitle,
  } = useTextInput(Validator.isValidBookTitle);
  const {
    value: description,
    setValue: setDescription,
    onInput: onInputDescription,
  } = useTextInput();
  const canSubmit = title && description;

  const {book, NotAuthorAlert} = useMyBookInfo(+bookId!);
  const {mutate: updateBookInfo, isLoading: isUpdating} = useMutation(
    () => api.books.updateBookInfo(book!.id, {coverImage, title, description}),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keys.GET_MY_BOOKS]);
        navigate("/studio/dashboard");
      },
    },
  );

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onSubmit = () => updateBookInfo();
  const onCancel = () => navigate(-1);

  const {RequestSignInDialog} = useAuthGuard();
  useEffect(() => {
    if (!book) return;
    setTitle(book.title);
    setDescription(book.description);
  }, [book]);

  if (!book)
    return (
      <div className="mobile-view p-6 pt-16">
        <div className="flex flex-row justify-between items-center">
          <span className="text-[24px] font-bold">작품 개요 수정하기</span>
        </div>
        <div className="mt-1 self-stretch border-t-2 border-[#2D3648]" />
        <AnimatePresence mode="wait">
          <motion.div
            className="absolute inset-0 m-auto w-full h-full bg-white flex justify-center items-center"
            initial={{opacity: 0}}
            animate={{opacity: 0.5}}
            exit={{opacity: 0}}>
            <SpinningLoader color="#BDBDBD" />
          </motion.div>
        </AnimatePresence>

        <RequestSignInDialog />
        <NotAuthorAlert />
      </div>
    );

  return (
    <div className="mobile-view p-6 pt-16">
      <div className="flex flex-row justify-between items-center">
        <span className="text-[24px] font-bold">작품 개요 수정하기</span>
      </div>
      <div className="mt-1 self-stretch border-t-2 border-[#2D3648]" />
      <SizedBox height={24} />

      <BookCoverImageUploader
        coverImageUrl={book.coverImageUrl ?? undefined}
        setCoverImage={setCoverImage as (file: File) => void}
      />
      <SizedBox height={16} />
      <BookTitleInput title={title} isValid={isValid} onInput={onInputTitle} />
      <SizedBox height={4} />
      <BookDescriptionTextarea
        description={description}
        onInput={onInputDescription as ChangeEventHandler}
      />

      <div className="mt-4 flex justify-center gap-[20px]">
        <button
          className="px-10 py-3 border-2 border-[#171717] rounded-lg font-bold text-[18px] text-[#171717]"
          onClick={onCancel}>
          취소
        </button>
        <button
          className="px-10 py-3 bg-[#242424] rounded-lg font-bold text-[18px] text-white disabled:bg-[#CECECE] transition-colors"
          onClick={onSubmit}
          disabled={!canSubmit}>
          수정
        </button>
      </div>

      {isUpdating ? (
        <motion.div
          className="absolute inset-0 m-auto w-full h-full bg-white flex justify-center items-center"
          initial={{opacity: 0}}
          animate={{opacity: 0.5}}
          exit={{opacity: 0}}>
          <SpinningLoader color="#BDBDBD" />
        </motion.div>
      ) : null}

      <RequestSignInDialog />
      <NotAuthorAlert />
    </div>
  );
}
