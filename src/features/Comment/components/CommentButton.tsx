import {PublishedBook} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import {ReactComponent as ChatIcon} from "assets/icons/chat.svg";
import {useNavigate} from "react-router-dom";

type Props = {
  book: PublishedBook;
  showCount?: boolean;
};

export default function CommentButton({book, showCount = false}: Props) {
  const navigate = useNavigate();
  const onGoCommentPage = () => {
    navigate(`/books/${book.id}/comments`);
  };

  return (
    <button className="flex flex-col items-center p-1.5" onClick={onGoCommentPage}>
      <ChatIcon width={24} height={24} fill="#171717" />
      {showCount ? (
        <span className="font-semibold text-[12px]">{toCompactNumber(book.commentsCount)}</span>
      ) : null}
    </button>
  );
}
