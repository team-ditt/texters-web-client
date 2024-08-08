import {SizedBox} from "@/components";
import ChoiceDestinationPageSelectModal from "@/features/FlowChart/components/ChoiceDestinationPageSelectModal";
import {useDestinationPages} from "@/features/FlowChart/hooks";
import {useModal} from "@/hooks";
import {Choice} from "@/types/book";
import {ReactComponent as DownArrowCircleIcon} from "assets/icons/down-arrow-circle.svg";

type Props = {
  bookId: number;
  pageId: number;
  choice: Choice;
};

export default function ChoiceDestinationPageSelect({bookId, pageId, choice}: Props) {
  const {isOpen, openModal, closeModal} = useModal();
  const {allPages} = useDestinationPages();

  const getPageTitle = (pageId: number | null) => {
    if (!pageId) return "";
    return allPages.find(page => page.id === pageId)?.title;
  };

  return (
    <>
      <button
        className="relative flex justify-between items-center w-[300px] px-4 bg-[#D1D1D1] border-2 border-black rounded-lg"
        onClick={openModal}
        disabled={true}>
        <DownArrowCircleIcon className="-rotate-90" fill="#2D2D2D" />
        <SizedBox width={8} />
        <span className="flex-1 text-left line-clamp-1">
          {choice.destinationPageId ? getPageTitle(choice.destinationPageId) : "연결된 페이지 없음"}
        </span>
      </button>
      <ChoiceDestinationPageSelectModal
        isOpen={isOpen}
        bookId={bookId}
        pageId={pageId}
        choice={choice}
        pages={allPages}
        onRequestClose={closeModal}
      />
    </>
  );
}
