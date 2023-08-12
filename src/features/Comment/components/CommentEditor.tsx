import {api} from "@/api";
import {Modal} from "@/components";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {useModal, useTextInput} from "@/hooks";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as CheckCircleIcon} from "assets/icons/check-circle.svg";
import {ChangeEvent, ChangeEventHandler, MouseEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  bookId: number;
};

export default function CommentEditor({bookId}: Props) {
  const MAX_CONTENT_LENGTH = 2000;

  const didSignIn = useDidSignIn();
  const navigate = useNavigate();
  const {isOpen, openModal, closeModal} = useModal();
  const onConfirm = () => {
    closeModal();
    navigate("/sign-in", {replace: true});
  };

  const [isSpoiler, setIsSpoiler] = useState(false);
  const onToggleSpoiler = () => {
    if (!checkSignIn()) return;
    setIsSpoiler(state => !state);
  };

  const {value: content, setValue: setContent, onInput: onInputContent} = useTextInput();
  const _onInputContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!checkSignIn()) return event.preventDefault();
    if (event.currentTarget.value.length > MAX_CONTENT_LENGTH) return;
    (onInputContent as ChangeEventHandler)(event);
  };

  const queryClient = useQueryClient();
  const {mutate: submitComment, isLoading} = useMutation(api.comments.createComment, {
    onSuccess: () => {
      setContent("");
      setIsSpoiler(false);
      queryClient.invalidateQueries([keys.GET_BOOK_COMMENTS, bookId]);
    },
  });
  const onSubmit = () => {
    if (!checkSignIn()) return;
    submitComment({
      bookId,
      content,
      isSpoiler,
    });
  };

  const onClickTextarea = (event: MouseEvent<HTMLDivElement>) => {
    if (!checkSignIn()) return event.preventDefault();
  };
  const checkSignIn = () => {
    if (!didSignIn) {
      if (!isOpen) openModal();
      return false;
    }
    return true;
  };

  return (
    <div
      className={`transition-all pb-2 bg-white border-t-[2px] ${
        content.length > 0 ? "border-[#3D3D3D]" : "border-[#C1C1C1]"
      }`}
      style={{
        boxShadow:
          content.length > 0
            ? "0px 0px 0px 0px rgba(0, 0, 0, 0.10), 0px -1px 3px 0px rgba(0, 0, 0, 0.10), 0px -5px 5px 0px rgba(0, 0, 0, 0.09)"
            : "none",
      }}>
      <div className="px-6 py-4 flex flex-row gap-[14px] items-center">
        <div className="grow" onClick={onClickTextarea}>
          <TextareaAutosize
            className="w-full text-[14px] text-[#3D3D3D] placeholder:text-[#3D3D3D] resize-none bg-white disabled:bg-white"
            minRows={1}
            maxRows={3}
            placeholder="댓글을 입력해주세요."
            value={content}
            disabled={!didSignIn}
            onInput={_onInputContent}
            maxLength={MAX_CONTENT_LENGTH}
          />
        </div>
        <button
          className={`self-start px-[12px] py-[6px] rounded-[4px] text-white text-[14px] font-[700] ${
            content.length > 0 ? "bg-[#3D3D3D]" : "bg-[#C1C1C1]"
          }`}
          disabled={content.length === 0}
          onClick={onSubmit}>
          작성
        </button>
      </div>
      <div className="px-6 py-[10px] flex justify-between items-center">
        <button className="flex flex-row gap-[2px] items-center" onClick={onToggleSpoiler}>
          <CheckCircleIcon stroke={isSpoiler ? "#F04438" : "#6F6F6F"} />
          <span
            className={`text-[12px] font-[400] ${isSpoiler ? "text-[#F04438]" : "text-[#6F6F6F]"}`}>
            스포일러를 포함하고 있습니다.
          </span>
        </button>
        <div className="flex flex-row gap-[2px] items-center text-[12px] text-[#6F6F6F] font-[700]">
          <span>{content.length.toLocaleString()}</span>
          <span>/2,000</span>
        </div>
      </div>
      <Modal.Dialog
        isOpen={isOpen}
        title="로그인이 필요한 서비스에요"
        message="댓글은 로그인 후 달 수 있어요, 로그인 할까요?"
        confirmMessage="로그인하기"
        onConfirm={onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}
