import {api} from "@/api";
import {SizedBox} from "@/components";
import {keys} from "@/constants";
import ThreadItem from "@/features/Board/components/ThreadItem";
import {useProfile} from "@/features/Member/hooks";
import {useInfiniteScroll} from "@/hooks";
import {Thread, ThreadQueryOrderType} from "@/types/board";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ReactComponent as BookOpenIcon} from "assets/icons/book-open.svg";
import classNames from "classnames";
import {MouseEvent, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

type Props = {
  boardId: string;
};

export default function AllThreadList({boardId}: Props) {
  const {profile} = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = useState<ThreadQueryOrderType>(
    (searchParams.get("order") as ThreadQueryOrderType) ?? "created-at",
  );

  const {data, hasNextPage, fetchNextPage, isFetching} = useInfiniteQuery(
    [keys.GET_BOARD_THREADS, boardId, order],
    ({pageParam = 0}) =>
      api.boards.fetchThreads(boardId, {type: "all", order, page: pageParam + 1, limit: 10}),
    {
      getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page : undefined),
    },
  );
  const fetchNext = () => {
    if (hasNextPage) fetchNextPage();
  };
  const threads = data?.pages.flatMap(page => page.data) ?? [];

  const onReorder = (by: ThreadQueryOrderType) => {
    searchParams.set("order", by);
    setSearchParams(searchParams, {replace: true});
  };

  useEffect(() => {
    setOrder((searchParams.get("order") as ThreadQueryOrderType) ?? "created-at");
  }, [searchParams]);

  const {triggerRef} = useInfiniteScroll(fetchNext);

  const navigate = useNavigate();
  const onNavigate = (event: MouseEvent, thread: Thread) => {
    // if (!isThreadAccessible(thread)) return;
    const overlay = document.querySelector(".ReactModal__Overlay");
    if (overlay?.contains(event.target as Node)) return;
    navigate(`/boards/${boardId}/threads/${thread.id}`);
  };

  // const isThreadAccessible = (thread: Thread) =>
  //   !thread.isHidden || thread.isAuthor || profile?.role === "ROLE_ADMIN";

  if (!isFetching && threads.length === 0)
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <BookOpenIcon width={64} height={64} />
        <SizedBox height={8} />
        <span className="font-bold text-[24px] text-[#CCCCCC]">새 스레드를 만들어주세요!</span>
      </div>
    );
  return (
    <div className="flex-1 flex flex-col w-full items-stretch px-[10px] bg-white gap-[10px]">
      <div className="h-[46px] flex flex-row justify-end gap-4 border-b border-[#ECECEC]">
        <button
          className={classNames("font-semibold text-[14px]", {
            "text-[#AFAFAF]": order !== "created-at",
          })}
          onClick={() => onReorder("created-at")}>
          {order === "created-at" ? "✓ " : "· "}
          최신순
        </button>
        <button
          className={classNames("font-semibold text-[14px]", {
            "text-[#AFAFAF]": order !== "liked",
          })}
          onClick={() => onReorder("liked")}>
          {order === "liked" ? "✓ " : "· "}
          추천순
        </button>
      </div>
      {threads.map(thread => (
        <div
          key={thread.id}
          // className={`rounded-lg flex flex-col ${
          // isThreadAccessible(thread) ? "cursor-pointer" : ""
          // }`}
          onClick={(event: MouseEvent) => onNavigate(event, thread)}>
          <ThreadItem boardId={boardId} thread={thread} />
        </div>
      ))}
      <div className="w-full h-20" ref={triggerRef} />
    </div>
  );
}
