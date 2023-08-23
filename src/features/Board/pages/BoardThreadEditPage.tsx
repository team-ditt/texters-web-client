import {api} from "@/api";
import {Modal, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {
  ThreadContentTextarea,
  ThreadFixedCheckBox,
  ThreadHiddenCheckBox,
  ThreadTitleInput,
} from "@/features/Board/components";
import {useFullHeight, useModal, usePasswordCheck, useTextInput} from "@/hooks";
import {Thread, UpdateThreadForm} from "@/types/board";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {motion} from "framer-motion";
import {ChangeEventHandler, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function BoardThreadEditPage() {
  const {boardId, threadId} = useParams();

  const {value: title, setValue: setTitle, onInput: onInputTitle} = useTextInput();
  const {value: content, setValue: setContent, onInput: onInputContent} = useTextInput();
  const [isHidden, setIsHidden] = useState(false);
  const toggleHidden = () => setIsHidden(!isHidden);
  const [isFixed, setIsFixed] = useState(false);
  const toggleFixed = () => setIsFixed(!isFixed);
  const [password, setPassword] = useState<string>();

  const {
    data: thread,
    error,
    isError,
  } = useQuery(
    [keys.GET_BOARD_THREAD, boardId, threadId],
    () => api.boards.fetchThread(boardId!, +threadId!),
    {
      enabled: !!boardId && !!threadId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
  useEffect(() => {
    if (!thread) return;
    setTitle(thread.title);
    setContent(thread.content);
    setIsHidden(thread.isHidden);
    setIsFixed(thread.isFixed);
  }, [thread]);

  const canSubmit = title.length > 0 && content.length > 0;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {mutate: submitThread, isLoading: isUpdating} = useMutation(
    (form: UpdateThreadForm) => api.boards.updateThread(boardId!, +threadId!, form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keys.GET_BOARD_THREADS, boardId!]);
        queryClient.invalidateQueries([keys.GET_BOARD_FIXED_THREADS, boardId!]);
        queryClient.invalidateQueries([keys.GET_BOARD_THREAD, boardId!, +threadId!]);
        navigate(`/boards/${boardId}/threads/${threadId}`, {replace: true});
      },
    },
  );
  const onSubmit = () => {
    submitThread({
      title,
      content,
      isFixed: false,
      password,
    });
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
        <ThreadContentTextarea content={content} onInput={onInputContent as ChangeEventHandler} />
        {thread?.authorRole ? (
          <div className="flex flex-row gap-6 items-center">
            {thread?.authorRole === "ROLE_USER" ? (
              <ThreadHiddenCheckBox isHidden={isHidden} disabled={true} onToggle={toggleHidden} />
            ) : null}
            {thread?.authorRole === "ROLE_ADMIN" ? (
              <ThreadFixedCheckBox isFixed={isFixed} disabled={isHidden} onToggle={toggleFixed} />
            ) : null}
          </div>
        ) : null}
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
          수정완료
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
      {thread ? (
        <ThreadAuthGuard boardId={boardId!} thread={thread} onAuthSuccess={setPassword} />
      ) : null}
    </div>
  );
}

type ThreadAuthGuard = {
  boardId: string;
  thread: Thread;
  onAuthSuccess: (password: string) => void;
};
function ThreadAuthGuard({boardId, thread, onAuthSuccess}: ThreadAuthGuard) {
  const navigate = useNavigate();

  const {
    isOpen: isInvalidModalOpen,
    openModal: openInvalidModal,
    closeModal: closeInvalidModal,
  } = useModal();

  const {checkPassword, PasswordPrompt} = usePasswordCheck(password =>
    api.boards.authThread(boardId, thread.id, password),
  );

  useEffect(() => {
    if (!thread.authorRole)
      checkPassword({
        onSuccess: onAuthSuccess,
        onFail: password => {
          if (password === undefined) navigate(-1);
          else openInvalidModal();
        },
      });
  }, [thread]);

  const onGoBack = () => {
    closeInvalidModal;
    navigate(-1);
  };

  return (
    <>
      <Modal.Alert
        isOpen={isInvalidModalOpen}
        title="비밀번호가 맞지 않아요! 다시 확인해주세요"
        onRequestClose={onGoBack}
      />
      <PasswordPrompt
        title="비밀번호를 입력해주세요!"
        message="스레드를 수정하기 위해서는 스레드 작성시 사용했던 비밀번호가 필요해요."
      />
    </>
  );
}
