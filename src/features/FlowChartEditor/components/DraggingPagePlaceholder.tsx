import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {
  PAGE_CONTENT_HORIZONTAL_MARGIN,
  PAGE_CONTENT_VERTICAL_MARGIN,
} from "@/features/FlowChartEditor/utils/calculator";

export default function DraggingPagePlaceholder() {
  const pages = useFlowChartEditorStore(state => state.viewStates.pages);
  const draggingState = useFlowChartEditorStore(state => state.draggingState);

  if (draggingState.isDragging !== "page" || draggingState.sourceId === null) return;
  const transition = pages[draggingState.sourceId].transition;
  const elementState = transition?.dst ?? pages[draggingState.sourceId].elementState;
  if (!elementState) return;

  return (
    <DynamicElementLocator>
      <div
        style={{
          position: "absolute",
          transform: `translate(${elementState.box.x}px, ${elementState.box.y}px) scale(${elementState.scale})`,
          opacity: elementState.opacity * 0.3,
          width: elementState.box.width,
          height: elementState.box.height,
          paddingLeft: 16,
          transition: "all 0.2s ease",
        }}>
        <div
          className={`rounded-[10px] px-[16px]`}
          style={{
            borderWidth: 2,
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 0.17)",
            height: `calc(100% - ${PAGE_CONTENT_VERTICAL_MARGIN * 2}px)`,
            margin: `${PAGE_CONTENT_VERTICAL_MARGIN}px ${PAGE_CONTENT_HORIZONTAL_MARGIN}px`,
            transition: "all 0.3s ease",
          }}></div>
      </div>
    </DynamicElementLocator>
  );
}
