import {api} from "@/api";
import {SizedBox} from "@/components";
import {keys} from "@/constants";
import {BookCoverImage} from "@/features/Book/components";
import {useInfiniteScroll} from "@/hooks";
import {Book} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ReactComponent as LikedIcon} from "assets/icons/liked.svg";
import {ReactComponent as ViewedIcon} from "assets/icons/viewed.svg";
import {motion} from "framer-motion";
import {useMemo} from "react";
import {useNavigate} from "react-router-dom";

type Props = {
  memberId: number;
};

export default function DashboardBookList({memberId}: Props) {
  const {data, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    [keys.GET_MY_BOOKS, memberId],
    ({pageParam = 0}) => api.books.fetchMyBooks({memberId, page: pageParam + 1, limit: 10}),
    {getNextPageParam: lastPage => lastPage.hasNext},
  );
  const fetchNext = () => {
    if (hasNextPage) fetchNextPage();
  };
  const books = data?.pages.flatMap(page => page.data) ?? [];

  const {triggerRef} = useInfiniteScroll(fetchNext);

  if (!books.length)
    return (
      <div className="flex-1 flex justify-center items-center">
        <span className="font-bold text-[36px] text-[#CCCCCC]">
          당신만의 새 작품을 만들어 주세요!
        </span>
      </div>
    );

  return (
    <div className="flex flex-col items-stretch gap-[12px]">
      {books.map(book => (
        <DashboardBookListItem key={book.id} book={book} />
      ))}
      <div ref={triggerRef} />
    </div>
  );
}

type ListItemProps = {
  book: Book;
};

function DashboardBookListItem({book}: ListItemProps) {
  const navigate = useNavigate();

  const onNavigate = () => navigate(`/studio/books/${book.id}/flow-chart`);

  return useMemo(
    () => (
      <motion.button
        className="border border-black rounded-lg flex items-center"
        onClick={onNavigate}
        whileHover={{scale: 1.01}}>
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
          <span className="font-semibold text-[14px] text-[#1A202C]">공개완료</span>
          <span className="text-[14px] text-[#717D96] text-ellipsis line-clamp-1">
            {book.description}
          </span>
        </div>
      </motion.button>
    ),
    [book.id],
  );
}
