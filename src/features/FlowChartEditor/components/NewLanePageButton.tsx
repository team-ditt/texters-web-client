import StaticElementLocator from "@/features/FlowChartEditor/components/StaticElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {NEW_PAGE_BUTTON_MARGIN} from "@/features/FlowChartEditor/utils/calculator";

export default function NewLanePageButton() {
  const viewState = useFlowChartEditorStore(state => state.viewStates.newLanePageButton);
  const insertNewPage = useFlowChartEditorStore(state => state.insertNewPage);
  const elementState = viewState.elementState;
  const order = viewState.data;

  if (!elementState) return null;

  const handleClick = () => {
    insertNewPage(order.laneOrder, -1);
  };

  return (
    <StaticElementLocator zIndex={5}>
      <div
        style={{
          position: "absolute",
          transform: `translate(${elementState.box.x}px, ${elementState.box.y}px) scale(${elementState.scale})`,
          opacity: elementState.opacity,
          marginTop: -4,
          width: elementState.box.width,
          height: elementState.box.height - NEW_PAGE_BUTTON_MARGIN * 2,
        }}>
        <button
          className="w-full h-full flex justify-center items-center gap-[6px]"
          onClick={handleClick}>
          <div className="relative w-[22px] h-[22px] rounded-full border-[2.4px] border-[#A5A5A5]">
            <div className="w-full h-full p-[3px] flex justify-center items-center">
              <div className="w-full h-[2.4px] rounded-full bg-[#A5A5A5]"></div>
            </div>
            <div className="absolute top-0 w-full h-full p-[3px] flex justify-center items-center">
              <div className="w-full h-[2.4px] rounded-full bg-[#A5A5A5] rotate-90"></div>
            </div>
          </div>
          <div className="text-[#A5A5A5] text-[19px] font-[700] tracking-[-0.947px]">
            페이지 추가하기
          </div>
        </button>
      </div>
    </StaticElementLocator>
  );
}
