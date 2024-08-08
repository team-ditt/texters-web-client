import {api} from "@/api";
import {SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {
  ThreadContentTextarea,
  ThreadFixedCheckBox,
  ThreadHiddenCheckBox,
  ThreadTitleInput,
} from "@/features/Board/components";
import {useProfile} from "@/features/Member/hooks";
import {useFullHeight, usePasswordMutation, useTextInput} from "@/hooks";
import {CreateThreadForm, Thread} from "@/types/board";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {motion} from "framer-motion";
import {ChangeEventHandler, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function BoardThreadFormPage() {
  const {boardId} = useParams();
  const {profile} = useProfile();
  const didSignIn = useDidSignIn();

  const {value: title, onInput: onInputTitle} = useTextInput();
  const {value: content, onInput: onInputContent} = useTextInput();
  const [isHidden, setIsHidden] = useState(false);
  const toggleHidden = () => setIsHidden(!isHidden);
  const [isFixed, setIsFixed] = useState(false);
  const toggleFixed = () => setIsFixed(!isFixed);

  const canSubmit = title.length > 0 && content.length > 0;
  const navigate = useNavigate();
  const {withPassword, PasswordPrompt} = usePasswordMutation<CreateThreadForm>();
  const queryClient = useQueryClient();
  const {mutate: submitThread, isLoading} = useMutation(
    (form: CreateThreadForm) => api.boards.createThread(boardId!, form),
    {
      onSuccess: (thread: Thread) => {
        queryClient.invalidateQueries([keys.GET_BOARD_THREADS, boardId!]);
        queryClient.invalidateQueries([keys.GET_BOARD_FIXED_THREADS, boardId!]);
        navigate(`/boards/${boardId}/threads/${thread.id}`, {replace: true});
      },
    },
  );
  const onSubmit = () => {
    const form = {
      title,
      content,
      isHidden,
      isFixed,
    };
    if (didSignIn) submitThread(form);
    else withPassword(submitThread, form);
  };

  const {containerRef} = useFullHeight();
  const onGoBack = () => navigate(-1);

  return (
    <div
      ref={containerRef}
      className="mobile-view h-full overflow-hidden flex items-stretch z-[2000]">
      <div className="relative w-full h-[56px] px-6 flex flex-row justify-center items-center border-b-[2px] border-[#2D3648]">
        <button className="absolute left-6" onClick={onGoBack}>
          <LeftArrowIcon width="22" height="22" />
        </button>
        <div className="flex flex-row items-center gap-2">
          <span className="text-[22px] text-[#171717] font-[700]">
            {boardId === "idea" ? "아이디어" : "스레드"} 작성
          </span>
        </div>
      </div>
      <div className="grow p-6 flex flex-col gap-4">
        <ThreadTitleInput title={title} onInput={onInputTitle} />
        {/* <ThreadContentTextarea content={content} onInput={onInputContent as ChangeEventHandler} />
        {profile?.role ? (
          <div className="flex flex-row gap-6 items-center">
            {profile?.role === "ROLE_USER" ? (
              <ThreadHiddenCheckBox isHidden={isHidden} onToggle={toggleHidden} />
            ) : null}
            {profile?.role === "ROLE_ADMIN" ? (
              <ThreadFixedCheckBox isFixed={isFixed} onToggle={toggleFixed} />
            ) : null}
          </div>
        ) : null} */}
      </div>
      <div className="flex flex-row">
        <button
          className="grow bg-[#DFDFDF] p-2.5 text-[20px] text-white font-bold"
          onClick={onGoBack}>
          취소
        </button>
        <button
          className="grow bg-[#3D3D3D] disabled:bg-[#A5A5A5] p-2.5 text-[20px] text-white font-bold"
          onClick={onSubmit}
          disabled={!canSubmit}>
          등록
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

      <PasswordPrompt
        title="비밀번호를 설정해주세요!"
        message="비회원은 비밀번호를 설정해주어야 해요. 공백 입력시 수정 삭제가 불가능하니 유의해주세요!"
      />
    </div>
  );
}
