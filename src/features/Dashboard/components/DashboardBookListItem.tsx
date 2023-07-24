import {api} from "@/api";
import {FlatButton, SizedBox} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage} from "@/features/Book/components";
import {useModal} from "@/hooks";
import {DashboardBook} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as EditIcon} from "assets/icons/edit.svg";
import {ReactComponent as LikedIcon} from "assets/icons/liked.svg";
import {ReactComponent as MoreVerticalIcon} from "assets/icons/more-vertical.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import {ReactComponent as ViewedIcon} from "assets/icons/viewed.svg";
import {MouseEvent, memo, useState} from "react";
import {useNavigate} from "react-router-dom";

type Props = {
  book: DashboardBook;
};

function DashboardBookListItem({book}: Props) {
  const navigate = useNavigate();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const onNavigate = () => navigate(`/studio/books/${book.id}/flow-chart`);

  return (
    <button
      className="border border-black rounded-lg flex items-center hover:shadow-md transition-all duration-100"
      onClick={onNavigate}>
      <BookCoverImage
        className="h-full max-h-[112px] aspect-square rounded-s-lg"
        src={book.coverImageUrl ?? undefined}
      />

      <div className="flex-1 flex flex-col justify-between items-start self-stretch px-3 py-2">
        <span className="font-bold text-[18px] text-[#2D3648] text-ellipsis line-clamp-1">
          {book.title}
        </span>
        <div className="flex flex-row items-center">
          <ViewedIcon fill="#999999" />
          <span className="ms-0.5 text-[12px] text-[#999999]">{toCompactNumber(book.viewed)}</span>
          <SizedBox width={12} />
          <LikedIcon fill="#999999" />
          <span className="ms-0.5 text-[12px] text-[#999999]">{toCompactNumber(book.liked)}</span>
        </div>
        <BookStatusChip book={book} />
        <span className="text-[14px] text-[#717D96] text-ellipsis line-clamp-1">
          {book.description}
        </span>
      </div>

      <MoreButton book={book} />

      <div className="px-4 w-[200px] flex flex-col gap-1">
        <PublishButton book={book} />
        <DemoPlayButton book={book} />
      </div>
    </button>
  );
}

function BookStatusChip({book}: Props) {
  const backgroundColor = (() => {
    if (book.status === "PUBLISHED") return "#4A5468";
    if (book.canPublish) return "#8EDD9A";
    return "#FF9E9E";
  })();
  const message = (() => {
    if (book.status === "PUBLISHED") return "공개완료";
    if (book.canPublish) return "공개가능";
    return `공개불가 - ${book.publishErrors[0]}`;
  })();

  return (
    <span
      className="my-1 font-semibold text-[14px] px-3 rounded-full text-white"
      style={{backgroundColor}}>
      {message}
    </span>
  );
}

function MoreButton({book}: Props) {
  const {isOpen, openModal, closeModal} = useModal();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const {mutate: deleteBook, isLoading: isDeleting} = useMutation(
    () => api.books.deleteBook(book.id),
    {
      onSuccess: () => queryClient.invalidateQueries([keys.GET_MY_BOOKS]),
    },
  );

  const onToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    isOpen ? closeModal() : openModal();
  };

  const onEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`/studio/books/${book.id}/edit`);
  };

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (confirm("정말로 삭제하시겠어요? 한 번 삭제하면 다시 복구할 수 없어요!")) deleteBook();
  };

  return (
    <div className="relative">
      <button className="relative" onClick={onToggle}>
        <MoreVerticalIcon />
      </button>
      {isOpen ? (
        <div className="absolute top-12 right-[22px] w-[220px] flex flex-col border border-[#AFAFAF] rounded-[8px] bg-white overflow-hidden z-[3000]">
          <button
            className="px-4 py-2 border-b border-[#AFAFAF] flex justify-between items-center text-[#AFAFAF]"
            onClick={onEdit}>
            작품 기본정보 변경
            <EditIcon />
          </button>
          <button
            className="px-4 py-2 flex justify-between items-center text-[#FF0000]"
            onClick={onDelete}
            disabled={isDeleting}>
            이 작품 삭제하기
            <TrashIcon />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PublishButton({book}: Props) {
  const backgroundColor = (() => {
    if (book.status === "PUBLISHED") return "#FFFFFF";
    if (book.canPublish) return "#383838";
    return "#FF9E9E";
  })();
  const textColor = (() => {
    if (book.status === "PUBLISHED") return "#000000";
    return "#FFFFFF";
  })();
  const borderColor = (() => {
    if (book.status === "PUBLISHED") return "#000000";
    return "transparent";
  })();
  const message = (() => {
    if (book.status === "PUBLISHED") return "공개완료";
    if (book.canPublish) return "공개하기";
    return "공개불가";
  })();

  const queryClient = useQueryClient();
  const {mutate: publishBook, isLoading: isPublishing} = useMutation(
    () => api.books.publishBook(book.id),
    {
      onSuccess: () => queryClient.invalidateQueries([keys.GET_MY_BOOKS]),
    },
  );

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (confirm("정말로 공개하시겠어요? 한 번 공개한 작품은 수정할 수 없어요!")) publishBook();
  };

  return (
    <button
      className="w-full h-9 border rounded-md text-[18px] font-bold"
      style={{
        backgroundColor,
        color: textColor,
        borderColor,
      }}
      onClick={onClick}
      disabled={!book.canPublish || book.status === "PUBLISHED"}>
      {message}
    </button>
  );
}

function DemoPlayButton({book}: Props) {
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // TODO: 플레이 화면 구현 시 추가
  };

  return (
    <FlatButton className="h-9" onClick={onClick}>
      미리 플레이 해보기
    </FlatButton>
  );
}

export default memo(DashboardBookListItem);
