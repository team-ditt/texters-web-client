import {api} from "@/api";
import {keys} from "@/constants";
import {useInfiniteScroll} from "@/hooks";
import {useAuthStore} from "@/stores";
import {useInfiniteQuery} from "@tanstack/react-query";
import DashboardBookListItem from "./DashboardBookListItem";

type Props = {
  memberId: number;
};

export default function DashboardBookList({memberId}: Props) {
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const {data, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    [keys.GET_MY_BOOKS, memberId],
    ({pageParam = 0}) => api.books.fetchMyBooks({memberId, page: pageParam + 1, limit: 10}),
    {getNextPageParam: lastPage => lastPage?.hasNext, enabled: didSignIn},
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
