import {api} from "@/api";
import {keys} from "@/constants";
import {ThreadCommentEditor, ThreadCommentList, ThreadItem} from "@/features/Board/components";
import {useFullHeight} from "@/hooks";
import {TextersError} from "@/types/error";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {AxiosError} from "axios";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function BoardThreadPage() {
  const {boardId, threadId} = useParams();
  const navigate = useNavigate();

  const {data: thread, error} = useQuery(
    [keys.GET_BOARD_THREAD, boardId!, +threadId!],
    () => api.boards.fetchThread(boardId!, +threadId!),
    {enabled: !!boardId && !!threadId, refetchOnWindowFocus: false, retry: false},
  );

  useEffect(() => {
    const errorMessage = ((error as AxiosError)?.response?.data as TextersError)?.message;
    if (errorMessage) {
      alert(errorMessage);
      onGoHome();
    }
  }, [error]);

  const {containerRef} = useFullHeight();
  const onGoHome = () => navigate("/");
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
          {thread ? (
            <span className="text-[22px] text-[#8B8B8B]">{thread.commentsCount}</span>
          ) : null}
        </div>
      </div>
      <div className="grow h-0 overflow-auto flex flex-col">
        {thread ? (
          <div className="w-full p-4">
            <ThreadItem boardId={boardId!} thread={thread} />
          </div>
        ) : null}
        <div className="w-full grow h-0 flex flex-col">
          <ThreadCommentList boardId={boardId!} threadId={+threadId!} />
        </div>
      </div>
      <div className="w-full">
        <ThreadCommentEditor boardId={boardId!} threadId={+threadId!} />
      </div>
    </div>
  );
}
