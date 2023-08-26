import {api} from "@/api";
import {Modal, SizedBox} from "@/components";
import {keys, strings} from "@/constants";
import {useExpandableParagraphRef, useModal, usePasswordMutation} from "@/hooks";
import usePopupMenu from "@/hooks/usePopupMenu";
import {PasswordForm, Thread} from "@/types/board";
import {toCompactNumber, toDateString} from "@/utils/formatter";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as AlertTriangleIcon} from "assets/icons/alert-triangle.svg";
import {ReactComponent as ChatIcon} from "assets/icons/chat.svg";
import {ReactComponent as EditIcon} from "assets/icons/edit.svg";
import {ReactComponent as LockIcon} from "assets/icons/lock.svg";
import {ReactComponent as MoreVerticalIcon} from "assets/icons/more-vertical.svg";
import {ReactComponent as FilledThumbUpIcon} from "assets/icons/thumb-up-filled.svg";
import {ReactComponent as ThumbUpIcon} from "assets/icons/thumb-up.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import {ReactComponent as LogoNoBorder} from "assets/logo/logo-no-border.svg";
import classNames from "classnames";
import {MouseEvent, useState} from "react";
import {useNavigate} from "react-router-dom";

type ThreadItemProps = {
  boardId: string;
  thread: Thread;
};
export default function ThreadItem({boardId, thread}: ThreadItemProps) {
  const {paragraphRef, hasEllipsis, isExpanded, toggleExpand} = useExpandableParagraphRef();
  const onToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleExpand();
  };

  return (
    <div
      className={`w-full rounded-lg flex flex-col px-[14px] py-[18px] ${
        thread.isFixed ? "bg-[#555555] text-white" : "bg-[#EFEFEF] text-[#3D3D3D]"
      }`}>
      <span className="font-bold text-[22px] text-ellipsis line-clamp-2">{thread.title}</span>
      <div className="flex flex-row items-center mt-3 gap-1.5">
        {thread.authorRole === "ROLE_ADMIN" ? (
          <div className="w-[18px] h-[18px] flex justify-center items-center rounded-full bg-[#0085FF]">
            <LogoNoBorder fill="white" />
          </div>
        ) : null}
        <span className="flex-1 font-bold text-[18px] text-ellipsis line-clamp-2">
          {thread.authorName ?? strings.NON_MEMBER_NAME}
        </span>
        <span className="text-[16px] text-[#C1C1C1]">
          {toDateString(new Date(thread.createdAt))}
        </span>
      </div>
      <div className="mt-[12px] flex flex-row gap-2 items-start">
        {thread.isHidden ? <LockIcon className="mt-0.5" fill="#3D3D3D" /> : null}
        <div className="grow w-0 flex flex-col gap-[12px]">
          <p
            ref={paragraphRef}
            className={classNames(
              "flex-1 text-[14px] overflow-hidden text-ellipsis leading-[1.5rem] whitespace-pre-wrap",
              {
                "line-clamp-none": isExpanded,
                "line-clamp-[5]": !isExpanded,
                "text-white": thread.isFixed,
                "text-[#3D3D3D]": !thread.isFixed,
              },
            )}>
            {thread.content}
          </p>
          {hasEllipsis ? (
            <button
              className={`text-[14px] font-[700] text-left ${
                thread.isFixed ? "text-white" : "text-[#8B8B8B]"
              }`}
              onClick={onToggleExpand}>
              {isExpanded ? "접기" : "더보기"}
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-[18px]">
        <div className="flex flex-row items-center">
          <LikeButton boardId={boardId} thread={thread} />
          <SizedBox width={24} />
          <div className="flex flex-row items-center">
            <ChatIcon fill={thread.isFixed ? "white" : "#C1C1C1"} width={18} height={18} />
            <SizedBox width={10} />
            <span
              className={`ms-0.5 text-[14px] ${thread.isFixed ? "text-white" : "text-[#C1C1C1]"}`}>
              {toCompactNumber(thread.commentsCount)}
            </span>
          </div>
        </div>
        <div>
          <MoreButton boardId={boardId} thread={thread} />
        </div>
      </div>
    </div>
  );
}

function LikeButton({boardId, thread}: ThreadItemProps) {
  const [isLiked, setIsLiked] = useState(false);

  const queryClient = useQueryClient();
  const {mutate: likeThread} = useMutation(() => api.boards.likeThread(boardId, thread.id), {
    onSuccess: () => {
      queryClient.invalidateQueries([keys.GET_BOARD_THREADS, boardId]);
      queryClient.invalidateQueries([keys.GET_BOARD_FIXED_THREADS, boardId]);
      queryClient.invalidateQueries([keys.GET_BOARD_THREAD, boardId, thread.id]);
      setIsLiked(true);
    },
    onError: () => {
      openModal();
    },
  });

  const {isOpen, openModal, closeModal} = useModal();

  const onLikeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (thread.isHidden) return;
    likeThread();
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <button
          onClick={onLikeClick}
          style={{cursor: thread.isHidden ? "cursor-default" : "cursor-pointer"}}>
          {isLiked ? (
            <FilledThumbUpIcon fill={thread.isFixed ? "white" : "#3D3D3D"} />
          ) : (
            <ThumbUpIcon fill={thread.isFixed ? "white" : "#C1C1C1"} />
          )}
        </button>
        <SizedBox width={10} />
        <span
          className={`ms-0.5 text-[14px] ${
            thread.isFixed ? "text-white" : isLiked ? "text-[#3D3D3D]" : "text-[#C1C1C1]"
          }`}>
          {toCompactNumber(thread.liked)}
        </span>
      </div>
      <Modal.Alert
        isOpen={isOpen}
        title="추천은 24시간에 1번만 누를 수 있어요!"
        onRequestClose={closeModal}
      />
    </>
  );
}

function MoreButton({boardId, thread}: ThreadItemProps) {
  const navigate = useNavigate();

  const {anchorRef, openPopupMenu, closePopupMenu, PopupMenu} = usePopupMenu();

  const {
    isOpen: isInvalidModalOpen,
    openModal: openInvalidModal,
    closeModal: closeInvalidModal,
  } = useModal();

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {withPassword, PasswordPrompt} = usePasswordMutation();

  const queryClient = useQueryClient();
  const {mutate: deleteThread, isLoading: isDeleting} = useMutation(
    (form?: PasswordForm) => api.boards.deleteThread(boardId, thread.id, form?.password),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keys.GET_BOARD_THREADS, boardId]);
        queryClient.invalidateQueries([keys.GET_BOARD_THREAD, boardId, thread.id]);
        closeDeleteModal();
        navigate(`/boards/${boardId}/threads`);
      },
      onError: () => {
        if (!thread.authorRole) openInvalidModal();
      },
    },
  );

  const onEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closePopupMenu();
    navigate(`/boards/${boardId}/threads/${thread.id}/edit`);
  };

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closePopupMenu();
    if (!thread.authorRole) withPassword(deleteThread);
    else openDeleteModal();
  };

  const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openPopupMenu();
  };

  return (
    <>
      <div className="relative">
        <button ref={anchorRef} onClick={onButtonClick}>
          <MoreVerticalIcon
            className="m-[2px]"
            width="18"
            height="18"
            fill={thread.isFixed ? "white" : "#C1C1C1"}
          />
        </button>
      </div>
      <PopupMenu vAlign="top-bottom" hAlign="right-right">
        <div
          className={`flex flex-col items-center border-[2px] rounded-[8px] bg-white overflow-hidden z-[12000] text-[14px] border-[#171717]`}
          style={{
            boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.15)",
          }}>
          {thread.isAuthor || !thread.authorRole ? (
            <>
              <button
                className="px-[12px] py-[4px] flex justify-between items-center gap-[18px] text-[#242424] font-[600] border-b"
                onClick={onEdit}>
                스레드 수정하기
                <EditIcon width="18" height="18" fill="#242424" />
              </button>
              <button
                className="px-[12px] py-[4px] flex justify-between items-center gap-[16px] text-[#F04438] font-[600] border-b"
                onClick={onDelete}
                disabled={isDeleting}>
                스레드 삭제하기
                <TrashIcon width="20" height="20" stroke="#F04438" />
              </button>
            </>
          ) : null}
          {!thread.isAuthor ? (
            <button
              className="px-[12px] py-[4px] flex justify-between items-center gap-[16px] text-[#A5A5A5] font-[600]"
              disabled={true}>
              스레드 신고하기
              <AlertTriangleIcon width="18" height="18" stroke="#A5A5A5" />
            </button>
          ) : null}
        </div>
      </PopupMenu>
      <Modal.Dialog
        isOpen={isDeleteOpen}
        title="정말로 스레드를 삭제하시겠어요?"
        confirmMessage="삭제하기"
        onConfirm={deleteThread as () => void}
        onCancel={closeDeleteModal}
      />
      <PasswordPrompt
        title="정말로 스레드를 삭제하시겠어요?"
        message="스레드 작성시 사용했던 비밀번호를 입력해 주세요!"
        confirmMessage="삭제하기"
      />
      <Modal.Alert
        isOpen={isInvalidModalOpen}
        title="비밀번호가 맞지 않아요! 다시 확인해주세요"
        onRequestClose={closeInvalidModal}
      />
    </>
  );
}
