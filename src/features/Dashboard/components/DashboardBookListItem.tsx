import {api} from "@/api";
import {FlatButton, Modal, SizedBox} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage} from "@/features/Book/components";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useModal} from "@/hooks";
import {useBookReaderStore, useFlowChartStore} from "@/stores";
import {DashboardBook} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as EditIcon} from "assets/icons/edit.svg";
import {ReactComponent as LikedIcon} from "assets/icons/liked.svg";
import {ReactComponent as MoreVerticalIcon} from "assets/icons/more-vertical.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import {ReactComponent as ViewedIcon} from "assets/icons/viewed.svg";
import {motion} from "framer-motion";
import {MouseEvent, memo, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {useNavigate} from "react-router-dom";

type Props = {
  book: DashboardBook;
};

function DashboardBookListItem({book}: Props) {
  const navigate = useNavigate();
  const {loadFlowChart} = useFlowChartStore();
  const clearFlowChart = useFlowChartEditorStore(state => state.clearFlowChart);
  const {isOpen, openModal, closeModal} = useModal();

  const onNavigate = (event: MouseEvent) => {
    const overlay = document.querySelector(".ReactModal__Overlay");
    if (overlay?.contains(event.target as Node)) return;
    if (book.status === "PUBLISHED") return openModal();

    clearFlowChart();
    loadFlowChart(book.id);
    navigate(`/studio/books/${book.id}/flow-chart`);
  };

  return (
    <>
      <motion.a
        className="border border-black rounded-lg flex items-center hover:shadow-md transition-all duration-100 cursor-pointer"
        whileHover={{scale: 1.01}}
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
            <span className="ms-0.5 text-[12px] text-[#999999]">
              {toCompactNumber(book.viewed)}
            </span>
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
          {book.status === "DRAFT" ? <DemoReadButton book={book} /> : null}
        </div>
      </motion.a>

      <Modal.Alert
        isOpen={isOpen}
        title="공개된 작품이에요"
        message="이미 공개된 작품은 수정할 수 없어요!"
        onRequestClose={closeModal}
      />
    </>
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const {isOpen, openModal, closeModal} = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const {mutate: deleteBook, isLoading: isDeleting} = useMutation(
    () => api.books.deleteBook(book.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([keys.GET_MY_BOOKS]);
        closeDeleteModal();
      },
    },
  );

  const onOpenModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openModal();
  };
  const onCloseModal = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    closeModal();
  };
  const onEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`/studio/books/${book.id}`);
  };
  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeModal();
    openDeleteModal();
  };

  useEffect(() => {
    if (!buttonRef.current) return;
    setOffset(buttonRef.current.getBoundingClientRect());
  }, [buttonRef]);
  useEffect(() => {
    function onUpdateOffset() {
      if (!buttonRef.current) return;
      setOffset(buttonRef.current.getBoundingClientRect());
    }

    const root = document.getElementById("root");
    root?.addEventListener("scroll", onUpdateOffset);
    root?.addEventListener("resize", onUpdateOffset);
    return () => {
      root?.removeEventListener("scroll", onUpdateOffset);
      root?.removeEventListener("resize", onUpdateOffset);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <button ref={buttonRef} onClick={onOpenModal}>
          <MoreVerticalIcon />
        </button>
        {isOpen
          ? createPortal(
              <>
                <div
                  className="fixed inset-0 w-full h-full bg-transparent z-[12000]"
                  onClick={onCloseModal}
                />
                <div
                  className="absolute top-0 left-0 w-[220px] flex flex-col border border-[#242424] rounded-[8px] bg-white overflow-hidden z-[12000]"
                  style={{
                    transform: `translate(${offset.x - 200}px, ${offset.y + 52}px)`,
                  }}>
                  {book.status === "DRAFT" ? (
                    <button
                      className="px-4 py-2 border-b border-[#242424] flex justify-between items-center text-[#242424]"
                      onClick={onEdit}>
                      작품 기본정보 변경
                      <EditIcon fill="#242424" />
                    </button>
                  ) : null}
                  <button
                    className="px-4 py-2 flex justify-between items-center text-[#FF0000]"
                    onClick={onDelete}
                    disabled={isDeleting}>
                    이 작품 삭제하기
                    <TrashIcon stroke="#FF0000" />
                  </button>
                </div>
              </>,
              document.body,
            )
          : null}
      </div>
      <Modal.Dialog
        isOpen={isDeleteOpen}
        title="작품 삭제"
        message="정말로 삭제하시겠어요? 한 번 삭제한 작품은 다시 복구할 수 없어요!"
        confirmMessage="삭제하기"
        onConfirm={deleteBook}
        onCancel={closeDeleteModal}
      />
    </>
  );
}

function PublishButton({book}: Props) {
  const backgroundColor = (() => {
    if (book.status === "PUBLISHED") return "#D9D9D9";
    if (book.canPublish) return "#242424";
    return "#FF9E9E";
  })();
  const textColor = (() => {
    if (book.status === "PUBLISHED") return "#A9A9A9";
    return "#FFFFFF";
  })();
  const message = (() => {
    if (book.status === "PUBLISHED") return "공개완료";
    if (book.canPublish) return "공개하기";
    return "공개불가";
  })();

  const {isOpen, openModal, closeModal} = useModal();

  const queryClient = useQueryClient();
  const {mutate: publishBook, isLoading: isPublishing} = useMutation(
    () => api.books.publishBook(book.id),
    {
      onSuccess: () => queryClient.invalidateQueries([keys.GET_MY_BOOKS]),
    },
  );

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openModal();
  };
  const onConfirm = () => {
    publishBook();
    closeModal();
  };

  return (
    <>
      <button
        className="w-full h-9 rounded-md text-[18px] font-bold"
        style={{
          backgroundColor,
          color: textColor,
        }}
        onClick={onClick}
        disabled={!book.canPublish || book.status === "PUBLISHED" || isPublishing}>
        {message}
      </button>
      <Modal.Dialog
        isOpen={isOpen}
        title="작품 공개"
        message="정말로 공개하시겠어요? 한 번 공개한 작품은 수정할 수 없어요!"
        confirmMessage="공개하기"
        onConfirm={onConfirm}
        onCancel={closeModal}
      />
    </>
  );
}

function DemoReadButton({book}: Props) {
  const navigate = useNavigate();
  const {removeLastVisitedPageId} = useBookReaderStore();

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    removeLastVisitedPageId(book.id.toString());
    navigate(`/studio/books/${book.id}/read`);
  };

  return (
    <FlatButton className="!h-9" onClick={onClick}>
      미리 읽어보기
    </FlatButton>
  );
}

export default memo(DashboardBookListItem);
