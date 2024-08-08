import {SizedBox} from "@/components";
import {BookCoverImage} from "@/features/Book/components";
import BookStatusChip from "@/features/Dashboard/components/BookStatusChip";
import BookUpdatableChip from "@/features/Dashboard/components/BookUpdatableChip";
import DashboardBookModal from "@/features/Dashboard/components/DashboardBookModal";
import {useModal} from "@/hooks";
import {DashboardBook} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import classNames from "classnames";
import {motion} from "framer-motion";

type Props = {
  book: DashboardBook;
};

export default function DashboardBookListItem({book}: Props) {
  const {isOpen, openModal, closeModal} = useModal();

  return (
    <>
      <motion.button
        className="border border-[#D9D9D9] rounded-lg shadow-md flex flex-col hover:shadow-lg transition-all duration-100 cursor-pointer overflow-hidden"
        whileHover={{scale: 1.01}}
        onClick={openModal}>
        <BookCoverImage className="w-full aspect-square" src={undefined} />

        <div className="flex-1 flex flex-col justify-between items-stretch self-stretch px-3 py-2">
          {/* <div className="flex gap-1">
            <BookStatusChip isPublished={book.isPublished} />
            {book.canUpdate ? <BookUpdatableChip /> : null}
          </div> */}

          <span className="text-left font-bold text-[18px] text-[#2D3648] text-ellipsis line-clamp-2">
            {book.title}
          </span>
          <span className="text-left text-[14px] text-[#717D96] text-ellipsis line-clamp-2">
            {book.description}
          </span>

          {/* <div className="my-2 border-t border-[#D9D9D9]" /> */}

          {/* <div className="flex flex-row items-center gap-1">
            <p className="flex flex-col items-center">
              <span className="text-[12px] text-[#999999]">조회수</span>
              <span
                className={classNames("text-[14px] font-bold text-[#999999]", {
                  "!text-[#242424]": book.viewed > 0,
                })}>
                {book.viewed > 0 ? toCompactNumber(book.viewed) : "-"}
              </span>
            </p>
            <SizedBox width={12} />
            <p className="flex flex-col items-center">
              <span className="text-[12px] text-[#999999]">좋아요</span>
              <span
                className={classNames("text-[14px] font-bold text-[#999999]", {
                  "!text-[#242424]": book.liked > 0,
                })}>
                {book.liked > 0 ? toCompactNumber(book.liked) : "-"}
              </span>
            </p>
            <SizedBox width={12} />
            <p className="flex flex-col items-center">
              <span className="text-[12px] text-[#999999]">댓글</span>
              <span
                className={classNames("text-[14px] font-bold text-[#999999]", {
                  "!text-[#242424]": book.commentsCount > 0,
                })}>
                {book.commentsCount > 0 ? toCompactNumber(book.commentsCount) : "-"}
              </span>
            </p>
          </div> */}
        </div>
      </motion.button>

      <DashboardBookModal book={book} isOpen={isOpen} onRequestClose={closeModal} />
    </>
  );
}
