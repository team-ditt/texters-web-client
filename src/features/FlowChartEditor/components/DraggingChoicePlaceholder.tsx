import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";

export default function DraggingChoicePlaceholder() {
  const choices = useFlowChartEditorStore(state => state.viewStates.choices);
  const draggingState = useFlowChartEditorStore(state => state.draggingState);

  if (draggingState.isDragging !== "choice" || draggingState.sourceId === null) return;
  const transition = choices[draggingState.sourceId].transition;
  const elementState = transition?.dst ?? choices[draggingState.sourceId].elementState;
  if (!elementState) return;

  return (
    <DynamicElementLocator zIndex={20}>
      <div
        style={{
          position: "absolute",
          transform: `translate(${elementState.box.x}px, ${elementState.box.y}px) scale(${elementState.scale})`,
          opacity: elementState.opacity * 0.3,
          width: elementState.box.width,
          height: elementState.box.height,
          paddingLeft: 32,
          paddingBottom: 12,
          transition: "all 0.2s ease",
          zIndex: 20,
        }}>
        <div className={`h-full border-[2px] border-black rounded-full px-[16px]`}></div>
      </div>
    </DynamicElementLocator>
  );
}
