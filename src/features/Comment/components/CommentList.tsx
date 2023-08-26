import {api} from "@/api";
import {Modal, SizedBox} from "@/components";
import {keys} from "@/constants";
import {useExpandableParagraphRef, useModal} from "@/hooks";
import usePopupMenu from "@/hooks/usePopupMenu";
import {Comment} from "@/types/comment";
import {toDateString} from "@/utils/formatter";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as AlertTriangleIcon} from "assets/icons/alert-triangle.svg";
import {ReactComponent as ChatIcon} from "assets/icons/chat.svg";
import {ReactComponent as EditPencilIcon} from "assets/icons/edit-pencil.svg";
import {ReactComponent as MoreVerticalIcon} from "assets/icons/more-vertical.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import classNames from "classnames";
import {HTMLAttributes, MouseEvent, useState} from "react";

type ListProps = HTMLAttributes<HTMLDivElement> & {
  comments: Comment[];
};

export default function CommentList({comments, className, ...props}: ListProps) {
  if (comments.length === 0)
    return (
      <div className="h-[calc(100%-1px)] flex flex-col justify-center items-center">
        <ChatIcon width={64} height={64} fill="#CCCCCC" />
        <SizedBox height={8} />
        <span className="font-bold text-[24px] text-[#CCCCCC]">
          여러분의 댓글로 여기를 채워주세요!
        </span>
      </div>
    );
  return (
    <div className={`self-stretch flex flex-col ${className}`} {...props}>
      {comments.map(comment => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

type ListItemProps = {
  comment: Comment;
};

function CommentListItem({comment}: ListItemProps) {
  const [isSpoilerAllowed, setIsSpoilerAllowed] = useState(false);

  const {paragraphRef, hasEllipsis, isExpanded, toggleExpand} = useExpandableParagraphRef();

  return (
    <div className={`px-6 ${comment.isCommenter ? "bg-[#F5F4F3]" : "white"}`}>
      <div className="flex flex-col py-[18px] border-b border-[#ECECEC]">
        <div className="flex flex-row justify-between mb-[12px]">
          <span className="text-[18px] text-[#171717] font-[700] flex flex-row items-center gap-[6px]">
            {comment.isAuthor ? (
              <div className="bg-[#171717] rounded-full w-[18px] h-[18px] flex justify-center items-center">
                <EditPencilIcon width="12" height="12" />
              </div>
            ) : null}
            {comment.commenterName}
          </span>
          <span
            className={`text-[16px] font-[400] ${
              comment.isCommenter ? "text-[#A5A5A5]" : "text-[#C1C1C1]"
            }`}>
            {toDateString(new Date(comment.createdAt))}
          </span>
        </div>
        <div className="flex justify-between mb-[18px]">
          {comment.isSpoiler && !isSpoilerAllowed ? (
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-[14px] text-[#F04438] font-[700]">스포일러 댓글입니다.</span>
              <button
                className={`px-[14px] py-[6px] rounded-full text-[14px] text-[#171717] font-[400] ${
                  comment.isCommenter ? "bg-[#D9D9D9]" : "bg-[#EFEFEF]"
                }`}
                onClick={() => setIsSpoilerAllowed(true)}>
                댓글보기
              </button>
            </div>
          ) : (
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
          )}
        </div>
        <div className="flex flex-row justify-between">
          <div></div>
          <MoreButton comment={comment} />
        </div>
      </div>
    </div>
  );
}

function MoreButton({comment}: ListItemProps) {
  const {anchorRef, openPopupMenu, PopupMenu} = usePopupMenu();

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const queryClient = useQueryClient();
  const {mutate: deleteComment, isLoading: isDeleting} = useMutation(
    () => api.comments.deleteComment(comment.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keys.GET_BOOK_COMMENTS]);
        closeDeleteModal();
      },
    },
  );

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openDeleteModal();
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
          {comment.isCommenter ? (
            <button
              className="px-[12px] py-[4px] flex justify-between items-center gap-[16px] text-[#F04438] font-[600]"
              onClick={onDelete}
              disabled={isDeleting}>
              댓글 삭제하기
              <TrashIcon width="20" height="20" stroke="#F04438" />
            </button>
          ) : (
            <button
              className="px-[12px] py-[4px] flex justify-between items-center gap-[16px] text-[#A5A5A5] font-[600]"
              disabled={true}>
              댓글 신고하기
              <AlertTriangleIcon width="18" height="18" stroke="#A5A5A5" />
            </button>
          )}
        </div>
      </PopupMenu>
      <Modal.Dialog
        isOpen={isDeleteOpen}
        title="정말로 댓글을 삭제하시겠어요?"
        confirmMessage="삭제하기"
        onConfirm={deleteComment}
        onCancel={closeDeleteModal}
      />
    </>
  );
}
