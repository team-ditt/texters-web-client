import {api} from "@/api";
import {keys} from "@/constants";
import {CommentEditor, CommentList} from "@/features/Comment/components";
import {useFullHeight, useInfiniteScroll} from "@/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {useNavigate, useParams} from "react-router-dom";

export default function CommentPage() {
  const {bookId} = useParams();
  const navigate = useNavigate();

  const {data, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    [keys.GET_BOOK_COMMENTS, bookId ? +bookId : undefined],
    ({pageParam = 0}) =>
      api.comments.fetchComments({bookId: +bookId!, page: pageParam + 1, limit: 10}),
    {getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page : undefined)},
  );
  const fetchNext = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };
  const totalCount = data?.pages?.[0]?.totalCount;
  const comments = data?.pages?.flatMap(page => page.data);

  const {triggerRef} = useInfiniteScroll(fetchNext);
  const {containerRef} = useFullHeight();

  const onGoBack = () => navigate(-1);

  return (
    <div
      ref={containerRef}
      className="mobile-view h-full overflow-hidden flex items-stretch z-[2000]">
      <div className="relative w-full h-[56px] px-6 flex flex-row justify-center items-center border-b-[2px] border-[#2D3648]">
        <button className="absolute left-6" onClick={onGoBack}>
          <LeftArrowIcon width="22" height="22" />
        </button>
        <div className="flex flex-row items-center gap-2">
          <span className="text-[22px] text-[#171717] font-[700]">댓글</span>
          {totalCount !== undefined ? (
            <span className="text-[22px] text-[#8B8B8B]">{totalCount}</span>
          ) : null}
        </div>
      </div>
      <div className="w-full grow h-0 overflow-y-auto">
        {comments ? <CommentList comments={comments} /> : null}
        <div ref={triggerRef} className="h-[1px]" />
      </div>
      <div className="w-full">
        <CommentEditor bookId={+bookId!} />
      </div>
    </div>
  );
}
