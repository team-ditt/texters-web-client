import {api} from "@/api";
import {SizedBox} from "@/components";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {useInfiniteScroll} from "@/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ReactComponent as BookOpenIcon} from "assets/icons/book-open.svg";
import DashboardBookListItem from "./DashboardBookListItem";

type Props = {
  memberId: number;
};

export default function DashboardBookList({memberId}: Props) {
  const didSignIn = useDidSignIn();
  const {data, hasNextPage, fetchNextPage} = useInfiniteQuery(
    [keys.GET_MY_BOOKS, memberId],
    ({pageParam = 0}) => api.books.fetchMyBooks({memberId, page: pageParam + 1, limit: 10}),
    {getNextPageParam: lastPage => lastPage?.hasNext, enabled: didSignIn},
  );
  const fetchNext = () => {
    if (didSignIn && hasNextPage) fetchNextPage({pageParam: data?.pageParams.length});
  };
  const books = data?.pages.flatMap(page => page.data) ?? [];

  const {triggerRef} = useInfiniteScroll(fetchNext);

  if (!books.length)
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <BookOpenIcon width={100} height={100} />
        <SizedBox height={8} />
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
