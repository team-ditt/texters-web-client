import {api} from "@/api";
import {FlatButton, MobileFooter, SizedBox} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage, BookLikeButton} from "@/features/Book/components";
import {useBookDescriptionRef, useBookTitleRef} from "@/features/Book/hooks";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as DownArrowIcon} from "assets/icons/down-arrow.svg";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import classNames from "classnames";
import {motion} from "framer-motion";
import {useNavigate, useParams} from "react-router-dom";

export default function BookInfoPage() {
  const {bookId} = useParams();
  const navigate = useNavigate();

  const {data: book} = useQuery([keys.GET_BOOK, bookId], () => api.books.fetchBook(+bookId!), {
    enabled: !!bookId,
  });
  const {titleRef} = useBookTitleRef(book?.title);
  const {descriptionRef, hasEllipsis, isExpanded, toggleExpand} = useBookDescriptionRef();

  const onGoBack = () => navigate(-1);

  const onGoReader = () => navigate(`/books/${bookId}/read`);

  if (!book) return <></>;

  return (
    <motion.div className="mobile-view pt-16">
      <div className="flex-1 flex flex-col px-6 pt-0 pb-8">
        <button onClick={onGoBack}>
          <LeftArrowIcon fill="#939393" />
        </button>
        <SizedBox height={12} />
        <BookCoverImage
          className="w-full max-w-[400px] self-center rounded-lg"
          src={book.coverImageUrl ?? undefined}
        />
        <SizedBox height={12} />
        <div className="flex justify-between items-center self-stretch">
          <span ref={titleRef} className="font-bold text-[20px] text-[#2D3648]">
            {book.title}
          </span>
          <BookLikeButton book={book} showCount />
        </div>
        <p
          ref={descriptionRef}
          className={classNames("text-[#2D3648] overflow-hidden text-ellipsis leading-[2rem]", {
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
        <FlatButton className="max-w-[400px] self-center" onClick={onGoReader}>
          읽기
        </FlatButton>
      </div>
      <MobileFooter />
    </motion.div>
  );
}
