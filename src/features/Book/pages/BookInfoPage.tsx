import {api} from "@/api";
import {FlatButton, MobileFooter, Modal, SizedBox} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage} from "@/features/Book/components";
import {useBookDescriptionRef, useBookLike, useBookTitleRef} from "@/features/Book/hooks";
import {useModal} from "@/hooks";
import {useAuthStore} from "@/stores";
import {toCompactNumber} from "@/utils/formatter";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as DownArrowIcon} from "assets/icons/down-arrow.svg";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {ReactComponent as LikedIcon} from "assets/icons/liked.svg";
import {ReactComponent as NotLikedIcon} from "assets/icons/not-liked.svg";
import classNames from "classnames";
import {motion} from "framer-motion";
import {useNavigate, useParams} from "react-router-dom";

export default function BookInfoPage() {
  const {bookId} = useParams();
  const navigate = useNavigate();
  const {didSignIn} = useAuthStore();
  const {isOpen, openModal, closeModal} = useModal();

  const {data: book} = useQuery([keys.GET_BOOK, bookId], () => api.books.fetchBook(+bookId!), {
    enabled: !!bookId,
  });
  const {titleRef} = useBookTitleRef(book?.title);
  const {isLiked, toggleLike} = useBookLike(book?.id);
  const {descriptionRef, hasEllipsis, isExpanded, toggleExpand} = useBookDescriptionRef();

  const onGoBack = () => navigate(-1);
  const onToggleLike = () => {
    if (!didSignIn()) return openModal();
    toggleLike();
  };
  const onConfirmSignIn = () => {
    closeModal();
    navigate("/sign-in");
  };

  if (!book) return <></>;

  return (
    <>
      <div className="mobile-view pt-16">
        <div className="flex-1 flex flex-col px-6 pt-0 pb-8">
          <button onClick={onGoBack}>
            <LeftArrowIcon fill="#939393" />
          </button>
          <SizedBox height={12} />
          <BookCoverImage
            className="w-full max-w-[400px] self-center rounded-lg"
            src={book.coverImageUrl ?? undefined}
          />
          <SizedBox height={24} />
          <div className="flex justify-between items-start self-stretch">
            <span ref={titleRef} className="font-bold text-[20px] text-[#2D3648]">
              {book.title}
            </span>
            <button className="flex flex-col items-center" onClick={onToggleLike}>
              {isLiked ? (
                <LikedIcon width={24} height={24} />
              ) : (
                <NotLikedIcon width={24} height={24} fill="#2D3648" />
              )}
              <span className="font-semibold text-[12px]">{toCompactNumber(book.liked)}</span>
            </button>
          </div>
          <SizedBox height={12} />
          <p
            ref={descriptionRef}
            className={classNames("text-[#2D3648] overflow-hidden text-ellipsis", {
              "line-clamp-none": isExpanded,
              "line-clamp-[10]": !isExpanded,
            })}>
            {book.description}
          </p>
          {hasEllipsis ? (
            <>
              <SizedBox height={12} />
              <button
                className="h-8 flex justify-center items-center gap-1 rounded-md border-2 border-[#BBBBBB] font-semibold text-[#797979]"
                onClick={toggleExpand}>
                {isExpanded ? "접기" : "펼쳐보기"}
                <motion.div>
                  <DownArrowIcon
                    className={classNames({
                      "rotate-180": isExpanded,
                    })}
                  />
                </motion.div>
              </button>
            </>
          ) : null}
          <SizedBox height={24} />
          <FlatButton className="max-w-[400px] self-center">읽기</FlatButton>
        </div>
        <MobileFooter />
      </div>

      <Modal.Dialog
        isOpen={isOpen}
        title="로그인하시겠어요?"
        message="좋아요 표시를 하기 위해서는 로그인을 해야 해요!"
        confirmMessage="로그인하기"
        onConfirm={onConfirmSignIn}
        onCancel={closeModal}
      />
    </>
  );
}
