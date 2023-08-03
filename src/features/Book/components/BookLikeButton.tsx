import {Modal} from "@/components";
import {useDidSignIn} from "@/features/Auth/hooks";
import {useBookLike} from "@/features/Book/hooks";
import {useModal} from "@/hooks";
import {Book} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import {ReactComponent as LikedIcon} from "assets/icons/liked.svg";
import {ReactComponent as NotLikedIcon} from "assets/icons/not-liked.svg";
import {useNavigate} from "react-router-dom";

type Props = {
  book: Book;
  showCount?: boolean;
};

export default function BookLikeButton({book, showCount = false}: Props) {
  const didSignIn = useDidSignIn();
  const navigate = useNavigate();
  const {isOpen, openModal, closeModal} = useModal();
  const {isLiked, toggleLike} = useBookLike(book.id);

  const onToggleLike = () => {
    if (!didSignIn) return openModal();
    toggleLike();
  };
  const onConfirmSignIn = () => {
    closeModal();
    navigate("/sign-in");
  };

  return (
    <>
      <button className="flex flex-col items-center p-1.5" onClick={onToggleLike}>
        {isLiked ? (
          <LikedIcon width={24} height={24} />
        ) : (
          <NotLikedIcon width={24} height={24} fill="#2D3648" />
        )}
        {showCount ? (
          <span className="font-semibold text-[12px]">{toCompactNumber(book.liked)}</span>
        ) : null}
      </button>
      <Modal.Dialog
        isOpen={isOpen}
        title="로그인하시겠어요?"
        message="좋아요 표시를 하기 위해서는 로그인을 해야 해요!"
        confirmMessage="로그인하기"
        onConfirm={onConfirmSignIn}
        onCancel={closeModal}
      />
    </>
  );
}
