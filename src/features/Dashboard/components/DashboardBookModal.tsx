import {Modal} from "@/components";
import SizedBox from "@/components/SizedBox";
import {BookCoverImage} from "@/features/Book/components";
import BookStatusChip from "@/features/Dashboard/components/BookStatusChip";
import BookUpdatableChip from "@/features/Dashboard/components/BookUpdatableChip";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useModal} from "@/hooks";
import {useBookReaderStore, useFlowChartStore} from "@/stores";
import {DashboardBook} from "@/types/book";
import {Validator} from "@/utils";
import {toCompactNumber} from "@/utils/formatter";
import {ReactComponent as BookOpenIcon} from "assets/icons/book-open.svg";
import {ReactComponent as CloseModalIcon} from "assets/icons/close-modal.svg";
import {ReactComponent as EyeOffIcon} from "assets/icons/eye-off.svg";
import {ReactComponent as EyeIcon} from "assets/icons/eye.svg";
import {ReactComponent as LinkBoldIcon} from "assets/icons/link-bold.svg";
import {ReactComponent as PlayBoldIcon} from "assets/icons/play-bold.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import {ReactComponent as UpdateIcon} from "assets/icons/update.svg";
import classNames from "classnames";
import {HTMLAttributes} from "react";
import ReactModal from "react-modal";
import {useNavigate} from "react-router-dom";

type Props = ReactModal.Props & {
  book: DashboardBook;
};

export default function DashboardBookModal({book, onRequestClose, ...props}: Props) {
  const navigate = useNavigate();
  const loadFlowChart = useFlowChartStore(state => state.loadFlowChart);
  const clearFlowChart = useFlowChartEditorStore(state => state.clearFlowChart);
  const resetHistory = useBookReaderStore(state => state.resetHistory);
  const {isOpen, openModal, closeModal} = useModal();

  const onClick = {
    toEditor: () => {
      if (Validator.isMobileDevice(navigator.userAgent)) return openModal();
      clearFlowChart();
      loadFlowChart(book.id);
      navigate(`/studio/books/${book.id}/editor`);
    },
    toDemoRead: () => {
      resetHistory(book.id.toString());
      navigate(`/studio/books/${book.id}/read`);
    },
    toPublishedBookInfo: () => {
      navigate(`/books/${book.id}`);
    },
  };

  return (
    <>
      <ReactModal
        overlayClassName="fixed inset-0 bg-overlay z-[12000]"
        className="absolute top-14 bottom-14 left-2 right-2 m-auto max-w-[320px] min-[480px]:max-w-[650px] min-[480px]:h-fit max-h-[700px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col justify-between overflow-hidden"
        closeTimeoutMS={200}
        onRequestClose={onRequestClose}
        appElement={document.getElementById("root") as HTMLElement}
        {...props}>
        <div className="w-full p-4 pt-12 flex flex-col gap-x-4 gap-y-2 min-[480px]:flex-row overflow-auto disable-scrollbar">
          <div className="absolute top-0 left-0 px-4 py-2 w-full flex justify-between bg-white">
            <span className="font-bold text-[22px] text-[#242424]">작품 정보</span>
            <button onClick={onRequestClose}>
              <CloseModalIcon width={28} height={28} />
            </button>
          </div>

          <div className="flex flex-col">
            <BookCoverImage
              className="w-full min-[480px]:max-w-[200px] min-[480px]:self-center aspect-square rounded-lg"
              src={book.coverImageUrl ?? undefined}
            />
            <BookStatistics className="hidden min-[480px]:flex" book={book} />
          </div>

          <div className="flex flex-col">
            <BookInfo book={book} />
            <div className="py-2 flex flex-wrap gap-1">
              <button
                className="px-2 py-1 border-[1.5px] border-[#242424] rounded-lg text-[14px] font-medium flex items-center gap-2"
                onClick={onClick.toDemoRead}>
                <PlayBoldIcon width={16} height={16} />
                미리 읽어보기
              </button>
              {book.isPublished ? (
                <button
                  className="px-2 py-1 border-[1.5px] border-[#242424] rounded-lg text-[14px] font-medium flex items-center gap-2"
                  onClick={onClick.toPublishedBookInfo}>
                  <LinkBoldIcon width={18} height={18} />
                  공개된 작품 보러가기
                </button>
              ) : null}
            </div>
            <BookStatistics className="min-[480px]:hidden" book={book} />
            <BookActions className="mt-2" book={book} />
          </div>
        </div>

        <button className="w-full min-h-[48px] bg-[#242424] text-white" onClick={onClick.toEditor}>
          <span>텍스터즈 에디터로 이동하기</span>
        </button>
      </ReactModal>

      <Modal.Alert
        isOpen={isOpen}
        title="모바일은 안돼요!"
        message="텍스터즈 에디터는 PC환경에서만 사용 가능해요! 작품을 작성/수정하려면 PC를 이용해주세요!"
        onRequestClose={closeModal}
      />
    </>
  );
}

function BookInfo({book}: {book: DashboardBook}) {
  return (
    <div className="flex-1 flex flex-col items-stretch self-stretch">
      <div className="flex gap-1">
        <BookStatusChip isPublished={book.isPublished} />
        {book.canUpdate ? <BookUpdatableChip /> : null}
      </div>
      <div className="py-1">
        <span className="text-left font-bold text-[18px] text-[#2D3648] text-ellipsis">
          {book.title}
        </span>
      </div>
      <span className="text-left text-[14px] text-[#717D96] text-ellipsis line-clamp-5">
        {book.description}
      </span>
    </div>
  );
}

function BookStatistics({book, className}: HTMLAttributes<HTMLDivElement> & {book: DashboardBook}) {
  return (
    <div
      className={`mt-2 px-4 py-2 w-full min-[480px]:max-w-[200px] rounded-lg bg-[#EFEFEF] flex flex-row justify-between items-center gap-1 ${className}`}>
      <p className="w-8 flex flex-col items-center">
        <span className="text-[12px] text-[#999999]">조회수</span>
        <span
          className={classNames("text-[14px] font-bold text-[#999999]", {
            "!text-[#242424]": book.viewed > 0,
          })}>
          {book.viewed > 0 ? toCompactNumber(book.viewed) : "-"}
        </span>
      </p>
      <SizedBox width={12} />
      <p className="w-8 flex flex-col items-center">
        <span className="text-[12px] text-[#999999]">좋아요</span>
        <span
          className={classNames("text-[14px] font-bold text-[#999999]", {
            "!text-[#242424]": book.liked > 0,
          })}>
          {book.liked > 0 ? toCompactNumber(book.liked) : "-"}
        </span>
      </p>
      <SizedBox width={12} />
      <p className="w-8 flex flex-col items-center">
        <span className="text-[12px] text-[#999999]">댓글</span>
        <span
          className={classNames("text-[14px] font-bold text-[#999999]", {
            "!text-[#242424]": book.commentsCount > 0,
          })}>
          {book.commentsCount > 0 ? toCompactNumber(book.commentsCount) : "-"}
        </span>
      </p>
    </div>
  );
}

function BookActions({book, className}: HTMLAttributes<HTMLDivElement> & {book: DashboardBook}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-bold text-[18px] text-[#242424]">작품 설정</span>
      <SizedBox height={8} />
      <div className="flex flex-wrap gap-x-1 gap-y-2">
        <button className="flex items-center gap-1.5 font-semibold text-[14px] ps-4 pe-5 h-7 border border-[#D9D9D9] rounded-md bg-[#EFEFEF] text-[#242424]">
          <BookOpenIcon width={16} height={16} fill="#242424" />
          작품 개요 수정하기
        </button>
        {book.isPublished ? null : (
          <button className="flex items-center gap-1.5 font-semibold text-[14px] ps-4 pe-5 h-7 rounded-md bg-[#0D77E7] text-white">
            <EyeIcon width={16} height={16} fill="white" />
            작품 공개하기
          </button>
        )}
        {book.canUpdate ? (
          <button className="flex items-center gap-1.5 font-semibold text-[14px] ps-4 pe-5 h-7 rounded-md bg-[#52B78F] text-white">
            <UpdateIcon width={16} height={16} fill="white" />
            작품 업데이트하기
          </button>
        ) : null}
        {book.isPublished ? (
          <button className="flex items-center gap-1.5 font-semibold text-[14px] ps-4 pe-5 h-7 rounded-md bg-[#888888] text-white">
            <EyeOffIcon width={16} height={16} fill="white" />
            작품 비공개하기
          </button>
        ) : null}
        <button className="flex items-center gap-1.5 font-semibold text-[14px] ps-4 pe-5 h-7 rounded-md bg-[#F04438] text-white">
          <TrashIcon width={16} height={16} fill="white" stroke="white" />
          작품 완전삭제하기
        </button>
      </div>
    </div>
  );
}
