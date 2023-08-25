import {api} from "@/api";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {usePasswordMutation, useTextInput} from "@/hooks";
import {ThreadCommentForm} from "@/types/board";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ChangeEvent, ChangeEventHandler} from "react";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  boardId: string;
  threadId: number;
};

export default function ThreadCommentEditor({boardId, threadId}: Props) {
  const MAX_CONTENT_LENGTH = 2000;

  const didSignIn = useDidSignIn();
  const {withPassword, PasswordPrompt} = usePasswordMutation<ThreadCommentForm>();

  const {value: content, setValue: setContent, onInput: onInputContent} = useTextInput();
  const _onInputContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value.length > MAX_CONTENT_LENGTH) return;
    (onInputContent as ChangeEventHandler)(event);
  };

  const queryClient = useQueryClient();
  const {mutate: submitComment, isLoading} = useMutation(
    (form: ThreadCommentForm) => api.boards.createComment(boardId, threadId, form),
    {
      onSuccess: () => {
        setContent("");
        queryClient.invalidateQueries([keys.GET_BOARD_THREADS, boardId]);
        queryClient.invalidateQueries([keys.GET_BOARD_FIXED_THREADS, boardId]);
        queryClient.invalidateQueries([keys.GET_BOARD_THREAD, boardId, threadId]);
        queryClient.invalidateQueries([keys.GET_BOARD_THREAD_COMMENTS, boardId, threadId]);
      },
    },
  );
  const onSubmit = () => {
    if (didSignIn) submitComment({content});
    else
      withPassword(submitComment, {
        content,
      });
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
        <div className="grow">
          <TextareaAutosize
            className="w-full text-[#3D3D3D] placeholder:text-[#3D3D3D] resize-none bg-white disabled:bg-white"
            minRows={1}
            maxRows={3}
            placeholder="댓글을 입력해주세요."
            value={content}
            onInput={_onInputContent}
            maxLength={MAX_CONTENT_LENGTH}
          />
        </div>
        <button
          className={`self-start px-[12px] py-[6px] rounded-[4px] text-white font-bold ${
            content.length > 0 ? "bg-[#3D3D3D]" : "bg-[#C1C1C1]"
          }`}
          disabled={content.length === 0}
          onClick={onSubmit}>
          작성
        </button>
      </div>
      <div className="px-6 py-[10px] flex justify-end items-center">
        <div className="flex flex-row gap-[2px] items-center text-[12px] text-[#6F6F6F] font-[700]">
          <span>{content.length.toLocaleString()}</span>
          <span>/2,000</span>
        </div>
      </div>
      <PasswordPrompt
        title="비밀번호를 설정해주세요!"
        message="비회원은 비밀번호를 설정해주어야 해요. 공백 입력시 수정 삭제가 불가능하니 유의해주세요!"
      />
    </div>
  );
}
