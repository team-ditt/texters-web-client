import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import usePageLimitAlertModalStore from "@/features/FlowChartEditor/stores/usePageLimitAlertModal";

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
        <div className="relative w-[20px] h-[20px] rounded-full border-[2px] border-[#A5A5A5]">
          <div className="w-full h-full p-[3px] flex justify-center items-center">
            <div className="w-full h-[2px] rounded-full bg-[#A5A5A5]"></div>
          </div>
          <div className="absolute top-0 w-full h-full p-[3px] flex justify-center items-center">
            <div className="w-full h-[2px] rounded-full bg-[#A5A5A5] rotate-90"></div>
          </div>
        </div>
        <div className="text-[#A5A5A5] text-[18px] font-[700] tracking-[-0.6px]">
          페이지 추가하기
        </div>
      </button>
    </>
  );
}
