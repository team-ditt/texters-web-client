import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {NEW_PAGE_BUTTON_MARGIN} from "@/features/FlowChartEditor/utils/calculator";

export default function NewPageButton() {
  const viewState = useFlowChartEditorStore(state => state.viewStates.newPageButton);
  const insertNewPage = useFlowChartEditorStore(state => state.insertNewPage);
  const elementState = viewState.elementState;
  const order = viewState.data;

  if (!elementState) return null;

  const handleClick = () => {
    insertNewPage(order.laneOrder, order.pageOrder);
  };

  return (
    order.pageOrder !== -1 && (
      <DynamicElementLocator zIndex={5}>
        <div
          className="absolute"
          style={{
            transform: `translate(${elementState.box.x}px, ${elementState.box.y - 8}px) scale(${
              elementState.scale
            })`,
            opacity: elementState.opacity,
            marginTop: -4,
            width: elementState.box.width,
            height: elementState.box.height - NEW_PAGE_BUTTON_MARGIN * 2,
          }}>
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
        </div>
      </DynamicElementLocator>
    )
  );
}
