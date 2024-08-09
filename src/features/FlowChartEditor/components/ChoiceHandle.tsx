import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {ReactComponent as DragHandleIcon} from "assets/icons/drag-handle.svg";
import {useRef} from "react";

type Props = {
  choiceId: number;
};

const OFFSET = {
  x: 12,
  y: 12,
};

export default function ChoiceHandle({choiceId}: Props) {
  const draggingState = useFlowChartEditorStore(state => state.draggingState);
  const hoveringState = useFlowChartEditorStore(state => state.hoveringState);
  const choiceViewState = useFlowChartEditorStore(state => state.viewStates.choices[choiceId]);
  const startDragChoice = useFlowChartEditorStore(state => state.startDragChoice);
  const elementState = choiceViewState.elementState;
  if (!elementState) return;
  const isDragging = draggingState.isDragging === "choice" && draggingState.sourceId === choiceId;
  const isHovering = hoveringState.isHovering === "choice" && hoveringState.sourceId === choiceId;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleHandlePressed = (event: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const {top, left} = container.getBoundingClientRect();
    startDragChoice(choiceId, {
      x: event.clientX - left + OFFSET.x,
      y: event.clientY - top + OFFSET.y,
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute cursor-move z-50 select-none"
      style={{
        transform: `translate(${OFFSET.x}px, ${OFFSET.y}px)`,
        opacity: isDragging || isHovering ? 1 : 0,
      }}
      onMouseDown={handleHandlePressed}>
      <DragHandleIcon width={16} height={16} />
    </div>
  );
}
