import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import NewPageButtonContent from "@/features/FlowChartEditor/components/NewPageButtonContent";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {NEW_PAGE_BUTTON_MARGIN} from "@/features/FlowChartEditor/utils/calculator";

export default function NewPageButton() {
  const viewState = useFlowChartEditorStore(state => state.viewStates.newPageButton);
  const elementState = useFlowChartEditorStore(
    state => state.viewStates.newPageButton.elementState,
  );
  const order = viewState.data;

  if (!elementState) return null;

  return (
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
        <NewPageButtonContent laneOrder={order.laneOrder} pageOrder={order.pageOrder} />
      </div>
    </DynamicElementLocator>
  );
}
