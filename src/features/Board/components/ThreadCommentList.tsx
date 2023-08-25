import {api} from "@/api";
import {Modal, SizedBox} from "@/components";
import {keys, strings} from "@/constants";
import {useExpandableParagraphRef, useInfiniteScroll, useModal} from "@/hooks";
import usePasswordMutation from "@/hooks/usePasswordMutation";
import usePopupMenu from "@/hooks/usePopupMenu";
import {PasswordForm, ThreadComment} from "@/types/board";
import {toDateString} from "@/utils/formatter";
import {useInfiniteQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as AlertTriangleIcon} from "assets/icons/alert-triangle.svg";
import {ReactComponent as ChatIcon} from "assets/icons/chat.svg";
import {ReactComponent as EditPencilIcon} from "assets/icons/edit-pencil.svg";
import {ReactComponent as MoreVerticalIcon} from "assets/icons/more-vertical.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import {ReactComponent as LogoNoBorder} from "assets/logo/logo-no-border.svg";
import classNames from "classnames";
import {MouseEvent} from "react";

type Props = {
  boardId: string;
  threadId: number;
};

export default function ThreadCommentList({boardId, threadId}: Props) {
  const {data, hasNextPage, fetchNextPage} = useInfiniteQuery(
    [keys.GET_BOARD_THREAD_COMMENTS, boardId, threadId],
    ({pageParam = 0}) =>
      api.boards.fetchComments(boardId, threadId, {page: pageParam + 1, limit: 10}),
    {
      getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page : undefined),
    },
  );
  const fetchNext = () => {
    if (hasNextPage) fetchNextPage();
  };
  const comments = data?.pages.flatMap(page => page.data) ?? [];

  const {triggerRef} = useInfiniteScroll(fetchNext);

  if (comments.length === 0)
    return (
      <div className="grow flex py-4 flex-col justify-center items-center">
        <ChatIcon width={64} height={64} fill="#CCCCCC" />
        <SizedBox height={8} />
        <span className="font-bold text-[24px] text-[#CCCCCC]">
          여러분의 댓글로 여기를 채워주세요!
        </span>
      </div>
    );

  return (
    <div className="flex flex-col items-stretch">
      {comments.map(comment => (
        <ThreadCommentListItem
          key={comment.id}
          boardId={boardId}
          threadId={threadId}
          comment={comment}
        />
      ))}
      <div ref={triggerRef} />
    </div>
  );
}

type ThreadCommentListItemProps = {
  boardId: string;
  threadId: number;
  comment: ThreadComment;
};
function ThreadCommentListItem({boardId, threadId, comment}: ThreadCommentListItemProps) {
  const {paragraphRef, hasEllipsis, isExpanded, toggleExpand} = useExpandableParagraphRef();

  return (
    <div className={`px-6 ${comment.isCommenter ? "bg-[#F5F4F3]" : "white"}`}>
      <div className="flex flex-col py-[18px] border-b border-[#ECECEC]">
        <div className="flex flex-row justify-between mb-[12px]">
          <span className="text-[18px] text-[#171717] font-[700] flex flex-row items-center gap-1.5">
            {comment.isThreadAuthor || comment.commenterRole === "ROLE_ADMIN" ? (
              <div className="flex flex-row items-center gap-1">
                {comment.isThreadAuthor ? (
                  <div className="bg-[#171717] rounded-full w-[18px] h-[18px] flex justify-center items-center">
                    <EditPencilIcon width="12" height="12" />
                  </div>
                ) : null}
                {comment.commenterRole === "ROLE_ADMIN" ? (
                  <div className="w-[18px] h-[18px] flex justify-center items-center rounded-full bg-[#0085FF]">
                    <LogoNoBorder fill="white" />
                  </div>
                ) : null}
              </div>
            ) : null}
            {comment.commenterName ?? strings.NON_MEMBER_NAME}
          </span>
          <span
            className={`text-[16px] font-[400] ${
              comment.isCommenter ? "text-[#A5A5A5]" : "text-[#C1C1C1]"
            }`}>
            {toDateString(new Date(comment.createdAt))}
          </span>
        </div>
        <div className="flex justify-between mb-[18px]">
          <div className="w-full flex flex-col gap-[12px]">
            <p
              ref={paragraphRef}
              className={classNames(
                "flex-1 text-[14px] text-[#3D3D3D] overflow-hidden text-ellipsis leading-[1.5rem] whitespace-pre-wrap",
                {
                  "line-clamp-none": isExpanded,
                  "line-clamp-[5]": !isExpanded,
                },
              )}>
              {comment.content}
            </p>
            {hasEllipsis ? (
              <button
                className="text-[14px] text-[#8B8B8B] font-[700] text-left"
                onClick={toggleExpand}>
                {isExpanded ? "접기" : "더보기"}
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div></div>
          <MoreButton boardId={boardId} threadId={threadId} comment={comment} />
        </div>
      </div>
    </div>
  );
}

function MoreButton({boardId, threadId, comment}: ThreadCommentListItemProps) {
  const {anchorRef, openPopupMenu, closePopupMenu, PopupMenu} = usePopupMenu();

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isInvalidModalOpen,
    openModal: openInvalidModal,
    closeModal: closeInvalidModal,
  } = useModal();
  const {withPassword, PasswordPrompt} = usePasswordMutation();

  const queryClient = useQueryClient();
  const {mutate: deleteComment, isLoading: isDeleting} = useMutation(
    (form?: PasswordForm) =>
      api.boards.deleteComment(boardId, threadId, comment.id, form?.password),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keys.GET_BOARD_THREAD_COMMENTS, boardId, threadId]);
        closeDeleteModal();
      },
      onError: () => {
        if (!comment.commenterRole) openInvalidModal();
      },
    },
  );

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closePopupMenu();
    if (!comment.commenterRole) withPassword(deleteComment);
    else openDeleteModal();
  };

  return (
    <>
      <div className="relative">
        <button ref={anchorRef} onClick={openPopupMenu}>
          <MoreVerticalIcon
            className="m-[2px]"
            width="18"
            height="18"
            fill={comment.isCommenter ? "#A5A5A5" : "#C1C1C1"}
          />
        </button>
      </div>
      <PopupMenu vAlign="top-bottom" hAlign="right-right">
        <div
          className={`flex flex-col items-center border-[2px] rounded-[8px] bg-white overflow-hidden z-[12000] text-[14px] border-[#171717]`}
          style={{
            boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.15)",
          }}>
          {comment.isCommenter || !comment.commenterRole ? (
            <button
              className="px-[12px] py-[4px] flex justify-between items-center gap-[16px] text-[#F04438] font-[600] border-b"
              onClick={onDelete}
              disabled={isDeleting}>
              댓글 삭제하기
              <TrashIcon width="20" height="20" stroke="#F04438" />
            </button>
          ) : null}
          {!comment.isCommenter ? (
            <button
              className="px-[12px] py-[4px] flex justify-between items-center gap-[16px] text-[#A5A5A5] font-[600]"
              disabled={true}>
              댓글 신고하기
              <AlertTriangleIcon width="18" height="18" stroke="#A5A5A5" />
            </button>
          ) : null}
        </div>
      </PopupMenu>
      <Modal.Dialog
        isOpen={isDeleteOpen}
        title="정말로 댓글을 삭제하시겠어요?"
        confirmMessage="삭제하기"
        onConfirm={deleteComment as () => void}
        onCancel={closeDeleteModal}
      />
      <Modal.Alert
        isOpen={isInvalidModalOpen}
        title="비밀번호가 맞지 않아요! 다시 확인해주세요"
        onRequestClose={closeInvalidModal}
      />
      <PasswordPrompt
        title="정말로 댓글을 삭제하시겠어요?"
        message="댓글 작성시 사용했던 비밀번호를 입력해 주세요!"
        confirmMessage="삭제하기"
      />
    </>
  );
}
