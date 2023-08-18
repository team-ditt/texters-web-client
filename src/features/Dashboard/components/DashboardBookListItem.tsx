import {SizedBox} from "@/components";
import {BookCoverImage} from "@/features/Book/components";
import BookStatusChip from "@/features/Dashboard/components/BookStatusChip";
import BookUpdatableChip from "@/features/Dashboard/components/BookUpdatableChip";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useFlowChartStore} from "@/stores";
import {DashboardBook} from "@/types/book";
import {toCompactNumber} from "@/utils/formatter";
import classNames from "classnames";
import {motion} from "framer-motion";
import {MouseEvent} from "react";
import {useNavigate} from "react-router-dom";

type Props = {
  book: DashboardBook;
};

export default function DashboardBookListItem({book}: Props) {
  const navigate = useNavigate();
  const loadFlowChart = useFlowChartStore(state => state.loadFlowChart);
  const clearFlowChart = useFlowChartEditorStore(state => state.clearFlowChart);

  const navigateToFlowChart = () => {
    clearFlowChart();
    loadFlowChart(book.id);
    navigate(`/studio/books/${book.id}/flow-chart`);
  };

  const onNavigate = (event: MouseEvent) => {
    const overlay = document.querySelector(".ReactModal__Overlay");
    if (overlay?.contains(event.target as Node)) return;

    navigateToFlowChart();
  };

  return (
    <>
      <motion.a
        className="border border-[#D9D9D9] rounded-lg shadow-md flex flex-col hover:shadow-lg transition-all duration-100 cursor-pointer overflow-hidden"
        whileHover={{scale: 1.01}}
        onClick={onNavigate}>
        <BookCoverImage className="w-full aspect-square" src={book.coverImageUrl ?? undefined} />

        <div className="flex-1 flex flex-col justify-between items-stretch self-stretch px-3 py-2">
          <div className="flex gap-1">
            <BookStatusChip isPublished={book.isPublished} />
            {book.canUpdate ? <BookUpdatableChip /> : null}
          </div>

          <span className="font-bold text-[18px] text-[#2D3648] text-ellipsis line-clamp-2">
            {book.title}
          </span>
          <span className="text-[14px] text-[#717D96] text-ellipsis line-clamp-2">
            {book.description}
          </span>

          <div className="my-2 border-t border-[#D9D9D9]" />

          <div className="flex flex-row items-center gap-1">
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
          </div>
        </div>
      </motion.a>
    </>
  );
}
