import {api} from "@/api";
import {SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {
  BookCoverImageUploader,
  BookDescriptionTextarea,
  BookTitleInput,
} from "@/features/Book/components";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useAuthGuard, useTextInput} from "@/hooks";
import {useFlowChartStore} from "@/stores";
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

  const loadFlowChart = useFlowChartStore(state => state.loadFlowChart);
  const clearFlowChart = useFlowChartEditorStore(state => state.clearFlowChart);
  const {mutate: submitBookInfo, isLoading} = useMutation(api.books.createBook, {
    onSuccess: (book: Book) => {
      queryClient.invalidateQueries([keys.GET_MY_BOOKS]);

      clearFlowChart();
      loadFlowChart(book.id);
      navigate(`/studio/books/${book.id}/editor`, {replace: true});
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const onSubmit = () => submitBookInfo({title, description, coverImage});
  const onCancel = () => navigate(-1);

  const {RequestSignInDialog} = useAuthGuard();

  return (
    <div className="mobile-view p-6 pt-16">
      <div className="flex flex-row justify-between items-center">
        <span className="text-[24px] font-bold">작품 개요 작성하기</span>
      </div>
      <div className="mt-1 self-stretch border-t-2 border-[#2D3648]" />
      <SizedBox height={24} />

      <BookCoverImageUploader setCoverImage={setCoverImage as (file: File) => void} />
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
          저장
        </button>
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

      <RequestSignInDialog />
    </div>
  );
}
