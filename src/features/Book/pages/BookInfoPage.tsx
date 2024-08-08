import {FlatButton, MobileFooter, Modal, SizedBox, SpinningLoader} from "@/components";
import {BookCoverImage, BookLikeButton} from "@/features/Book/components";
import {useBookTitleRef, usePublishedBookInfo} from "@/features/Book/hooks";
import {CommentButton} from "@/features/Comment/components";
import {useExpandableParagraphRef, useModal} from "@/hooks";
import {useBookReaderStore} from "@/stores";
import useDashboardStore from "@/stores/useDashboardStore";
import {toCompactNumber, toDateString} from "@/utils/formatter";
import {ReactComponent as DownArrowIcon} from "assets/icons/down-arrow.svg";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import classNames from "classnames";
import {useNavigate, useParams} from "react-router-dom";

export default function BookInfoPage() {
  const {bookId} = useParams();
  const navigate = useNavigate();
  const {isOpen, openModal, closeModal} = useModal();

  const {books} = useDashboardStore();
  const book = books.find(b => b.id === +(bookId ?? -1));

  const {hasHistory, resetHistory} = useBookReaderStore();

  const {titleRef} = useBookTitleRef(book?.title, 32);
  const {paragraphRef, hasEllipsis, isExpanded, toggleExpand} = useExpandableParagraphRef();

  const onGoBack = () => navigate(-1);
  const onGoReader = () => {
    if (hasHistory(bookId!)) return openModal();
    navigate(`/books/${bookId}/read`);
  };
  const onGoIntroPage = () => {
    resetHistory(bookId!);
    closeModal();
    navigate(`/books/${bookId}/read`);
  };
  const onGoLastVisitedPage = () => {
    closeModal();
    navigate(`/books/${bookId}/read`);
  };

  if (!book)
    return (
      <div className="mobile-view justify-center items-center">
        <SpinningLoader color="#BBBBBB" />
      </div>
    );

  return (
    <div className="mobile-view pt-16">
      <div className="flex-1 flex flex-col px-6 pt-0 pb-8">
        <button onClick={onGoBack}>
          <LeftArrowIcon fill="#939393" />
        </button>
        <SizedBox height={12} />
        <BookCoverImage className="w-full max-w-[400px] self-center rounded-lg" src={undefined} />
        <SizedBox height={12} />
        <div className="flex justify-between items-center self-stretch">
          <span ref={titleRef} className="font-bold text-[22px] leading-[32px] text-[#2D3648]">
            {book.title}
          </span>
          <div className="flex">
            {/* <CommentButton book={book} showCount /> */}
            {/* <BookLikeButton book={book} showCount /> */}
          </div>
        </div>
        <SizedBox height={2} />
        <span className="font-bold text-[#494949]">{}</span>
        <SizedBox height={4} />
        {/* <div className="flex items-center gap-2">
          <span className="ms-0.5 text-[12px] text-[#999999]">
            조회수 {toCompactNumber(book.viewed)}
          </span>
          <span className="ms-0.5 text-[12px] text-[#999999]">
            작품 공개일 {toDateString(new Date(book.publishedAt))}
          </span>
        </div> */}
        <SizedBox height={8} />
        <p
          ref={paragraphRef}
          className={classNames(
            "flex-1 text-[#2D3648] overflow-hidden text-ellipsis leading-[2rem] whitespace-pre-wrap",
            {
              "line-clamp-none": isExpanded,
              "line-clamp-[10]": !isExpanded,
            },
          )}>
          {book.description}
        </p>
        {hasEllipsis ? (
          <>
            <SizedBox height={12} />
            <button
              className="h-8 w-full max-w-[400px] self-center flex justify-center items-center gap-1 rounded-md border-2 border-[#BBBBBB] font-semibold text-[#797979]"
              onClick={toggleExpand}>
              {isExpanded ? "접기" : "펼쳐보기"}
              <DownArrowIcon
                className={classNames({
                  "rotate-180": isExpanded,
                })}
              />
            </button>
          </>
        ) : null}
        <SizedBox height={24} />
        <FlatButton className="max-w-[400px] self-center" onClick={onGoReader}>
          읽기
        </FlatButton>
      </div>
      <MobileFooter />

      <Modal.Dialog
        isOpen={isOpen}
        title="읽던 부분이 있어요"
        message="이어서 읽으실래요?"
        confirmMessage="이어서 읽기"
        onConfirm={onGoLastVisitedPage}
        cancelMessage="처음부터 읽기"
        onCancel={onGoIntroPage}
        onRequestClose={closeModal}
        showClose
      />
    </div>
  );
}
