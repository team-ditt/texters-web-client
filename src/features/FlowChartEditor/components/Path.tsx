import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {
  calcChoicePointOffset,
  calcPagePointOffset,
} from "@/features/FlowChartEditor/utils/calculator";
import {useEffect} from "react";

type Props = {
  sourcePageId: number;
  sourceChoiceId: number;
  destinationPageId: number | null;
};

export default function Path({sourcePageId, sourceChoiceId, destinationPageId}: Props) {
  const pages = useFlowChartEditorStore(state => state.viewStates.pages);
  const choices = useFlowChartEditorStore(state => state.viewStates.choices);
  const draggingState = useFlowChartEditorStore(state => state.draggingState);
  const hoveringState = useFlowChartEditorStore(state => state.hoveringState);
  const startHover = useFlowChartEditorStore(state => state.startHover);
  const finishHover = useFlowChartEditorStore(state => state.finishHover);

  useEffect(() => {
    return finishHover;
  }, []);

  const sourceChoiceState = choices[sourceChoiceId].elementState;
  if (!sourceChoiceState) return;
  const sourcePageState = pages[sourcePageId].elementState;
  if (!sourcePageState) return;

  const isDraggingSourceChoice =
    draggingState.isDragging === "choice" && draggingState.sourceId === sourceChoiceId;
  const isDraggingSourcePage =
    draggingState.isDragging === "page" && draggingState.sourceId === sourcePageId;
  const isDraggingDestinationPage =
    draggingState.isDragging === "page" && draggingState.sourceId === destinationPageId;
  const isDraggingPath =
    draggingState.isDragging === "path" && draggingState.sourceId === sourceChoiceId;
  if (!isDraggingPath && destinationPageId === null) return;

  const isHovering =
    hoveringState.isHovering === "path" && hoveringState.sourceId === sourceChoiceId;
  const isHoveringSourceChoice =
    hoveringState.isHovering === "choice" && hoveringState.sourceId === sourceChoiceId;

  const highlight = !isDraggingPath && (isHovering || isHoveringSourceChoice);

  const sourceChoicePosition = isDraggingSourceChoice
    ? {
        x: draggingState.current.x - draggingState.offset.x,
        y: draggingState.current.y - draggingState.offset.y,
      }
    : isDraggingSourcePage
    ? {
        x:
          draggingState.current.x -
          draggingState.offset.x +
          sourceChoiceState.box.x -
          sourcePageState.box.x,
        y:
          draggingState.current.y -
          draggingState.offset.y +
          sourceChoiceState.box.y -
          sourcePageState.box.y,
      }
    : sourceChoiceState.box;

  const destinationPagePosition = isDraggingDestinationPage
    ? {
        x: draggingState.current.x - draggingState.offset.x,
        y: draggingState.current.y - draggingState.offset.y,
      }
    : pages[destinationPageId ?? -1]?.elementState?.box ?? {
        x: 0,
        y: 0,
      };

  const choicePointOffset = calcChoicePointOffset();
  const startPoint = {
    x: sourceChoicePosition.x + choicePointOffset.x,
    y: sourceChoicePosition.y + choicePointOffset.y,
  };
  const pagePointOffset = calcPagePointOffset();
  const endPoint =
    isDraggingPath && destinationPageId === null
      ? {
          x: draggingState.current.x - draggingState.offset.x,
          y: draggingState.current.y - draggingState.offset.y,
        }
      : {
          x: destinationPagePosition.x + pagePointOffset.x,
          y: destinationPagePosition.y + pagePointOffset.y,
        };

  const centerPoint = {
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2,
  };
  const length = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
  const rotation =
    (Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) / Math.PI) * 180;
  const strokeWidth = 4;

  const minOpacity = Math.min(
    sourcePageState.opacity,
    pages[destinationPageId ?? -1]?.elementState?.opacity ?? 1,
  );

  const handleHoverIn = () => {
    startHover("path", sourceChoiceId);
  };
  const handleHoverOut = () => {
    finishHover();
  };

  return (
    <div>
      <DynamicElementLocator zIndex={highlight ? 7 : 1}>
        <div
          className={`absolute rounded-full transition-colors ${
            highlight ? "bg-[#00CD15]" : "bg-[#242424]"
          }`}
          style={{
            transform: `translate(${centerPoint.x - length / 2}px, ${
              centerPoint.y - strokeWidth / 2
            }px) rotate(${rotation}deg)`,
            width: length,
            height: strokeWidth,
            opacity: minOpacity,
          }}
        />
      </DynamicElementLocator>
      <DynamicElementLocator zIndex={highlight ? 8 : 2}>
        <div
          className="absolute rounded-full"
          style={{
            transform: `translate(${centerPoint.x - length / 2}px, ${
              centerPoint.y - (strokeWidth * 3) / 2
            }px) rotate(${rotation}deg)`,
            width: length,
            height: strokeWidth * 3,
          }}
          onMouseOver={handleHoverIn}
          onMouseOut={handleHoverOut}
        />
      </DynamicElementLocator>
      <DynamicElementLocator zIndex={2}>
        {isDraggingPath && destinationPageId === null && (
          <div
            className="absolute w-[16px] h-[16px] rounded-full bg-[#242424]"
            style={{
              transform: `translate(${endPoint.x - 8}px, ${endPoint.y - 8}px)`,
              opacity: minOpacity,
            }}></div>
        )}
      </DynamicElementLocator>
    </div>
  );
}
