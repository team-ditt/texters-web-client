import NewPageButtonContent from "@/features/FlowChartEditor/components/NewPageButtonContent";
import StaticElementLocator from "@/features/FlowChartEditor/components/StaticElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {NEW_PAGE_BUTTON_MARGIN} from "@/features/FlowChartEditor/utils/calculator";

export default function NewLanePageButton() {
  const viewState = useFlowChartEditorStore(state => state.viewStates.newLanePageButton);
  const elementState = useFlowChartEditorStore(
    state => state.viewStates.newLanePageButton.elementState,
  );
  const order = viewState.data;

  if (!elementState) return null;

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
        <NewPageButtonContent laneOrder={order.laneOrder} pageOrder={-1} />
      </div>
    </StaticElementLocator>
  );
}
