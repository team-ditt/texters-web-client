import {api} from "@/api";
import {SizedBox} from "@/components";
import {keys} from "@/constants";
import {BookList} from "@/features/Book/components";
import {BookQueryOrderType} from "@/types/book";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ReactComponent as DownArrowIcon} from "assets/icons/down-arrow.svg";
import {ReactComponent as NoResultIcon} from "assets/icons/no-result.svg";
import {ReactComponent as SearchThinIcon} from "assets/icons/search-thin.svg";
import classNames from "classnames";
import {KeyboardEvent, useEffect, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";

export default function BookSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string | undefined>(searchParams.get("query") ?? undefined);
  const [order, setOrder] = useState<BookQueryOrderType>(
    (searchParams.get("order") as BookQueryOrderType) ?? "viewed",
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {data, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    [keys.GET_BOOKS, query, order],
    ({pageParam = 0}) => api.books.fetchBooks({query, page: pageParam + 1, limit: 10, order}),
    {getNextPageParam: lastPage => lastPage.hasNext},
  );
  const books = data?.pages.flatMap(page => page.data) ?? [];

  const onReorder = (by: BookQueryOrderType) => {
    searchParams.set("order", by);
    setSearchParams(searchParams);
  };

  const onSearch = () => {
    if (!searchInputRef.current || !searchInputRef.current.value) return;
    searchParams.set("query", searchInputRef.current.value);
    setSearchParams(searchParams);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSearch();
  };

  useEffect(() => {
    setQuery(searchParams.get("query") ?? undefined);
    setOrder((searchParams.get("order") as BookQueryOrderType) ?? "viewed");
    if (searchInputRef.current) searchInputRef.current.value = searchParams.get("query") ?? "";
  }, [searchParams]);

  return (
    <div className="mobile-view p-6">
      <div className="flex flex-row justify-end gap-[12px]">
        <button
          className={classNames("font-semibold text-[14px]", {
            "text-[#AFAFAF]": order !== "viewed",
          })}
          onClick={() => onReorder("viewed")}>
          {order === "viewed" ? "✓ " : "· "}
          조회순
        </button>
        <button
          className={classNames("font-semibold text-[14px]", {
            "text-[#AFAFAF]": order !== "liked",
          })}
          onClick={() => onReorder("liked")}>
          {order === "liked" ? "✓ " : "· "}
          좋아요순
        </button>
        <button
          className={classNames("font-semibold text-[14px]", {
            "text-[#AFAFAF]": order !== "published-date",
          })}
          onClick={() => onReorder("published-date")}>
          {order === "published-date" ? "✓ " : "· "}
          공개일자순
        </button>
      </div>
      <SizedBox height={24} />
      <div className="pe-1 rounded-lg border border-[#2D3648] overflow-hidden flex items-center">
        <input
          ref={searchInputRef}
          className="flex-1 p-2 ps-3 font-semibold placeholder:text-[#979797]"
          placeholder="작품 제목"
          onKeyDown={onKeyDown}
        />
        <button className="p-2" onClick={onSearch}>
          <SearchThinIcon width={20} height={20} />
        </button>
      </div>

      <SizedBox height={24} />
      {books.length ? (
        <BookList className="flex-1" books={books} />
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center gap-[8px]">
          <NoResultIcon />
          <span className="font-bold text-[24px] text-[#C8C8C8]">작품을 찾을 수 없어요</span>
        </div>
      )}
      <SizedBox height={20} />

      {hasNextPage ? (
        <button
          className="border-2 py-2 border-[#D9D9D9] rounded-[4px] flex justify-center items-center gap-1 font-semibold text-[14px] text-[#717171]"
          onClick={() => fetchNextPage({pageParam: data?.pageParams.length})}
          disabled={isFetchingNextPage}>
          더보기
          <DownArrowIcon />
        </button>
      ) : null}
    </div>
  );
}
