import {api} from "@/api";
import {DesktopAppBar, SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {
  BookCoverImageUploader,
  BookDescriptionTextarea,
  BookTitleInput,
} from "@/features/Book/components";
import {useAuthGuard, useMobileViewGuard, useTextInput} from "@/hooks";
import {Book} from "@/types/book";
import {Validator} from "@/utils";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {motion} from "framer-motion";
import {ChangeEventHandler, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function BookInfoFormPage() {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const {value: title, isValid, onInput: onInputTitle} = useTextInput(Validator.isValidBookTitle);
  const {value: description, onInput: onInputDescription} = useTextInput();
  const canSubmit = title && description;

  const {mutate: submitBookInfo, isLoading} = useMutation(api.books.createBook, {
    onSuccess: (book: Book) => {
      queryClient.invalidateQueries([keys.GET_MY_BOOKS]);
      navigate(`/studio/books/${book.id}/flow-chart`);
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onSubmit = () => submitBookInfo({title, description, coverImage});
  const onCancel = () => navigate(-1);

  const {RequestSignInDialog} = useAuthGuard();
  const {MobileViewAlert} = useMobileViewGuard();

  return (
    <div className="desktop-view">
      <DesktopAppBar />
      <div className="desktop-view-content p-6 relative">
        <div className="flex flex-row justify-between items-center">
          <span className="text-[28px] font-bold">작품 개요 작성하기</span>
        </div>
        <div className="mt-4 self-stretch border-t-2 border-[#2D3648]" />
        <SizedBox height={24} />

        <BookCoverImageUploader setCoverImage={setCoverImage as (file: File) => void} />
        <SizedBox height={16} />
        <BookTitleInput title={title} isValid={isValid} onInput={onInputTitle} />
        <SizedBox height={16} />
        <BookDescriptionTextarea
          description={description}
          onInput={onInputDescription as ChangeEventHandler}
        />

        <div className="mt-6 flex justify-center gap-[20px]">
          <button
            className="px-10 py-3 border-2 border-[#171717] rounded-lg font-bold text-[18px] text-[#171717]"
            onClick={onCancel}>
            취소
          </button>
          <button
            className="px-10 py-3 bg-[#242424] rounded-lg font-bold text-[18px] text-white disabled:bg-[#CECECE] transition-colors"
            onClick={onSubmit}
            disabled={!canSubmit}>
            저장
          </button>
        </div>
      </div>

      {isLoading ? (
        <motion.div
          className="absolute inset-0 m-auto w-full h-full bg-white flex justify-center items-center"
          initial={{opacity: 0}}
          animate={{opacity: 0.5}}
          exit={{opacity: 0}}>
          <SpinningLoader color="#BDBDBD" />
        </motion.div>
      ) : null}

      <MobileViewAlert />
      <RequestSignInDialog />
    </div>
  );
}
