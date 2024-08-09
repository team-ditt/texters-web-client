import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {ReactComponent as DragHandleIcon} from "assets/icons/drag-handle.svg";
import {useRef} from "react";

type Props = {
  pageId: number;
};

const OFFSET = {
  x: 58,
  y: 78,
};

export default function PageHandle({pageId}: Props) {
  const draggingState = useFlowChartEditorStore(state => state.draggingState);
  const hoveringState = useFlowChartEditorStore(state => state.hoveringState);
  const pageViewState = useFlowChartEditorStore(state => state.viewStates.pages[pageId]);
  const startDragPage = useFlowChartEditorStore(state => state.startDragPage);
  const elementState = pageViewState.elementState;
  if (!elementState) return;
  const isDragging = draggingState.isDragging === "page" && draggingState.sourceId === pageId;
  const isHovering = hoveringState.isHovering === "page" && hoveringState.sourceId === pageId;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleHandlePressed = (event: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const {top, left} = container.getBoundingClientRect();
    startDragPage(pageId, {
      x: event.clientX - left + OFFSET.x,
      y: event.clientY - top + OFFSET.y,
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute cursor-move select-none"
      style={{
        transform: `translate(${OFFSET.x}px, ${OFFSET.y}px)`,
        opacity: isDragging || isHovering ? 1 : 0,
      }}
      onMouseDown={handleHandlePressed}>
      <DragHandleIcon width={16} height={16} />
    </div>
  );
}
