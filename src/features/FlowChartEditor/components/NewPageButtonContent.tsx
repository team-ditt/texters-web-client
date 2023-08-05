import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import usePageLimitAlertModalStore from "@/features/FlowChartEditor/stores/usePageLimitAlertModal";
import {ReactComponent as PlusCircleIcon} from "assets/icons/plus-circle.svg";

type Props = {
  laneOrder: number;
  pageOrder: number;
};

export default function NewPageButtonContent({laneOrder, pageOrder}: Props) {
  const insertNewPage = useFlowChartEditorStore(state => state.insertNewPage);
  const {openModal} = usePageLimitAlertModalStore();

  const handleClick = () => {
    insertNewPage(laneOrder, pageOrder, () => {
      openModal();
    });
  };

  return (
    <>
      <button
        className="w-full h-full flex justify-center items-center gap-[5px]"
        onClick={handleClick}>
        <PlusCircleIcon width={22} height={22} stroke="#A5A5A5" fill="#A5A5A5" />
        <div className="text-[#A5A5A5] text-[18px] font-[700] tracking-[-0.6px]">
          페이지 추가하기
        </div>
      </button>
    </>
  );
}
