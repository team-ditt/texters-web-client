import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {
  PAGE_CONTENT_HORIZONTAL_MARGIN,
  PAGE_CONTENT_VERTICAL_MARGIN,
} from "@/features/FlowChartEditor/utils/calculator";

export default function DraggingPagePlaceholder() {
  const modelLanes = useFlowChartEditorStore(state => state.modelLanes);
  const lanes = useFlowChartEditorStore(state => state.viewStates.lanes);
  const pages = useFlowChartEditorStore(state => state.viewStates.pages);
  const draggingState = useFlowChartEditorStore(state => state.draggingState);

  if (draggingState.isDragging !== "page" || draggingState.sourceId === null) return;
  const transition = pages[draggingState.sourceId].transition;
  const elementState = transition?.dst ?? pages[draggingState.sourceId].elementState;
  if (!elementState) return;

  let draggingPageLaneOrder =
    Object.keys(lanes)
      .map(laneId => lanes[parseInt(laneId)]?.data)
      .find(lane => lane?.pages.some(page => page.id === draggingState.sourceId))?.order ?? -1;
  let minLane = 1;
  let maxLane = modelLanes.length - 1;

  const destinationPageIds = pages[draggingState.sourceId].data.choices
    .map(c => c.destinationPageId)
    .filter(x => x !== null);
  for (let laneOrder = 1; laneOrder < modelLanes.length; ++laneOrder) {
    const lane = modelLanes[laneOrder];
    for (let page of lane.pages) {
      for (let chioce of page.choices) {
        if (chioce.destinationPageId === draggingState.sourceId) {
          minLane = Math.max(minLane, laneOrder + 1);
        }
      }
      for (let destinationPageId of destinationPageIds) {
        if (page.id === destinationPageId) {
          maxLane = Math.min(maxLane, laneOrder - 1);
        }
      }
    }
  }

  const isValidLane = minLane <= draggingPageLaneOrder && draggingPageLaneOrder <= maxLane;

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
            borderWidth: isValidLane ? 2 : 3,
            borderColor: isValidLane ? "black" : "rgba(255, 82, 82, 0.92)",
            backgroundColor: isValidLane ? "rgba(255, 255, 255, 0.17)" : "rgba(255, 76, 76, 0.349)",
            height: `calc(100% - ${PAGE_CONTENT_VERTICAL_MARGIN * 2}px)`,
            margin: `${PAGE_CONTENT_VERTICAL_MARGIN}px ${PAGE_CONTENT_HORIZONTAL_MARGIN}px`,
            transition: "all 0.3s ease",
          }}></div>
      </div>
    </DynamicElementLocator>
  );
}
