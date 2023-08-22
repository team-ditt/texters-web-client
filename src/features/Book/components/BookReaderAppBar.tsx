import {SizedBox} from "@/components";
import BookLikeButton from "@/features/Book/components/BookLikeButton";
import {DashboardBook, PublishedBook} from "@/types/book";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

type Props = {
  book: DashboardBook | PublishedBook;
  showLike?: boolean;
};

export default function BookReaderAppBar({book, showLike = true}: Props) {
  const navigate = useNavigate();
  const lastScrollPositionRef = useRef(0);
  const [hidden, setHidden] = useState(false);

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    function onScroll(event: Event) {
      const currentScrollPosition = (event.target as HTMLDivElement).scrollTop;

      // 앱바 영역까지 스크롤시 항상 보이기
      if (currentScrollPosition <= 64) {
        lastScrollPositionRef.current = 0;
        return setHidden(false);
      }

      // 하단 스크롤 시 앱바 감추기
      if (currentScrollPosition > 64 && currentScrollPosition > lastScrollPositionRef.current) {
        lastScrollPositionRef.current = currentScrollPosition;
        setHidden(true);
      }

      // 상단 스크롤 100px 이상하면 다시 보이기
      if (lastScrollPositionRef.current - currentScrollPosition > 100) {
        lastScrollPositionRef.current = currentScrollPosition;
        setHidden(false);
      }
    }

    document.getElementById("root")?.addEventListener("scroll", onScroll);
    return () => document.getElementById("root")?.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-auto w-full max-w-[850px] h-16 px-4 bg-white flex justify-between items-center drop-shadow-md z-[1000]"
      variants={variants}
      initial="inactive"
      animate={hidden ? "inactive" : "active"}
      exit="inactive"
      transition={{ease: "easeInOut"}}>
      <button className="p-1.5" onClick={onGoBack}>
        <LeftArrowIcon />
      </button>
      <h1 className="flex-1 px-3 text-center font-bold line-clamp-1 text-ellipsis">{book.title}</h1>
      {showLike ? <BookLikeButton book={book as PublishedBook} /> : <SizedBox width={36} />}
    </motion.nav>
  );
}

const variants = {
  active: {y: 0},
  inactive: {y: "-100%"},
};
