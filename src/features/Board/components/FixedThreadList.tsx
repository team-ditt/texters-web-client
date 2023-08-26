import {api} from "@/api";
import {keys} from "@/constants";
import {Thread} from "@/types/board";
import {toDateString} from "@/utils/formatter";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

type Props = {
  boardId: string;
};

export default function FixedThreadList({boardId}: Props) {
  const {data, error} = useQuery(
    [keys.GET_BOARD_FIXED_THREADS, boardId],
    () => api.boards.fetchThreads(boardId, {type: "fixed", order: "created-at", page: 1, limit: 3}),
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
  const fixedThreads = data?.data ?? [];

  return (
    <div className="flex flex-col w-full items-stretch">
      {fixedThreads.map((thread, i) => (
        <div key={thread.id} className="flex flex-col">
          <FixedThreadListItem boardId={boardId} thread={thread} />
          {i < fixedThreads.length - 1 ? <div className="w-full h-[1px] bg-[#ECECEC]" /> : null}
        </div>
      ))}
    </div>
  );
}

type FixedThreadListItemProps = {
  boardId: string;
  thread: Thread;
};
function FixedThreadListItem({boardId, thread}: FixedThreadListItemProps) {
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(`/boards/${boardId}/threads/${thread.id}`);
  };

  return (
    <a
      className="w-full px-6 py-[14px] whitespace-pre bg-[white] cursor-pointer flex flex-row justify-between items-center"
      onClick={onNavigate}>
      <span className="flex-1 font-bold text-[18px] text-[#0085FF] text-ellipsis overflow-hidden">
        {thread.title}
      </span>
      <span className="text-[14px] text-[#C1C1C1]">{toDateString(new Date(thread.createdAt))}</span>
    </a>
  );
}
