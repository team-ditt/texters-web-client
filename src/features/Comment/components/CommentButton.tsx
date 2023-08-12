import {api} from "@/api";
import {keys} from "@/constants";
import {toCompactNumber} from "@/utils/formatter";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as ChatIcon} from "assets/icons/chat.svg";
import {useNavigate} from "react-router-dom";

type Props = {
  bookId: number;
  showCount?: boolean;
};

export default function CommentButton({bookId, showCount = false}: Props) {
  const navigate = useNavigate();
  const onGoCommentPage = () => {
    navigate(`/books/${bookId}/comments`);
  };

  const {data: paginatedComments, error} = useQuery(
    [keys.GET_BOOK_COMMENTS, bookId],
    () => api.comments.fetchComments({bookId, page: 1, limit: 10}),
    {
      enabled: !!bookId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
  const totalCount = paginatedComments?.totalCount;

  return (
    <button className="flex flex-col items-center p-1.5" onClick={onGoCommentPage}>
      <ChatIcon width={24} height={24} fill="#171717" />
      {showCount && totalCount !== undefined ? (
        <span className="font-semibold text-[12px]">{toCompactNumber(totalCount)}</span>
      ) : null}
    </button>
  );
}
