import ChoiceDelete from "@/features/FlowChartEditor/components/ChoiceDelete";
import ChoiceHandle from "@/features/FlowChartEditor/components/ChoiceHandle";
import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {calcChoicePointOffset} from "@/features/FlowChartEditor/utils/calculator";
import useDebounce from "@/hooks/useDebounce";
import {Choice} from "@/types/book";
import {ViewState} from "@/types/flowChartEditor";
import {ChangeEvent, useEffect, useState} from "react";

type Props = {
  viewState: ViewState<Choice>;
};

export default function Choice({viewState}: Props) {
  const choice = viewState.data;
  const elementState = viewState.elementState;
  const pageViewState = useFlowChartEditorStore(
    state => state.viewStates.pages[choice.sourcePageId],
  );
  const isEditable = useFlowChartEditorStore(state => state.isEditable());
  const draggingState = useFlowChartEditorStore(state => state.draggingState);
  const hoveringState = useFlowChartEditorStore(state => state.hoveringState);
  const updateChoiceContent = useFlowChartEditorStore(state => state.updateChoiceContent);
  const startDragPath = useFlowChartEditorStore(state => state.startDragPath);
  const startHover = useFlowChartEditorStore(state => state.startHover);
  const finishHover = useFlowChartEditorStore(state => state.finishHover);
  const [isPointHovering, setIsPointHovering] = useState(false);

  const [content, setContent] = useState(choice.content);
  const onInputContent = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length > 100) return;
    setContent(event.target.value);
  };
  useDebounce(
    current => {
      updateChoiceContent(choice.id, current);
    },
    1500,
    content,
    undefined,
    !content,
  );
  useEffect(() => {
    setContent(choice.content);
  }, [choice.content]);

  const isDragging = draggingState.isDragging === "choice" && draggingState.sourceId === choice.id;
  const isDraggingSourcePage =
    draggingState.isDragging === "page" && draggingState.sourceId === choice.sourcePageId;
  const isDraggingPath =
    draggingState.isDragging === "path" && draggingState.sourceId === choice.id;
  if (!elementState) return;
  const pageElementState = pageViewState.elementState;
  if (!pageElementState) return;

  const currentPosition = elementState.box;
  const draggingPositionOffset = isDragging
    ? {
        x: draggingState.current.x - draggingState.offset.x - currentPosition.x,
        y: draggingState.current.y - draggingState.offset.y - currentPosition.y,
      }
    : isDraggingSourcePage
    ? {
        x: draggingState.current.x - draggingState.offset.x - pageElementState.box.x,
        y: draggingState.current.y - draggingState.offset.y - pageElementState.box.y,
      }
    : {x: 0, y: 0};

  const isHovering = hoveringState.isHovering === "choice" && hoveringState.sourceId === choice.id;
  const isHoveringPath =
    hoveringState.isHovering === "path" && hoveringState.sourceId === choice.id;

  const handlePointPressed = () => {
    startDragPath(choice.id);
  };
  const handleHovered = () => {
    startHover("choice", choice.id);
  };

  return (
    <div onMouseOver={handleHovered} onMouseLeave={finishHover}>
      {isEditable && (
        <DynamicElementLocator zIndex={50}>
          <div
            style={{
              position: "absolute",
              transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) scale(${elementState.scale})`,
              width: 0,
              height: 0,
              transition: `all ${isDragging ? 0 : 0.05}s ease`,
            }}>
            <div
              className="w-full h-full"
              style={{
                transform: `translate(${draggingPositionOffset.x}px, ${draggingPositionOffset.y}px)`,
                transition: `all ${isDragging ? 0 : 0.05}s ease`,
              }}>
              <div
                className={`h-full w-full transition-all`}
                style={{
                  transformOrigin: `${elementState.box.width / 2}px ${
                    elementState.box.height / 2
                  }px`,
                }}>
                <ChoiceHandle choiceId={choice.id} />
                <ChoiceDelete choiceId={choice.id} />
              </div>
            </div>
          </div>
        </DynamicElementLocator>
      )}
      <DynamicElementLocator zIndex={isDraggingSourcePage || isDragging ? 13 : 12}>
        <div
          className="absolute"
          style={{
            transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) scale(${elementState.scale})`,
            opacity: elementState.opacity * (isDraggingSourcePage || isDragging ? 0.8 : 1),
            width: elementState.box.width,
            height: elementState.box.height,
            paddingLeft: isEditable ? 32 : 0,
            paddingBottom: 12,
            filter: isDraggingSourcePage || isDragging ? "blur(1px)" : "none",
          }}>
          <div
            className="w-full h-full"
            style={{
              transform: `translate(${draggingPositionOffset.x}px, ${draggingPositionOffset.y}px)`,
              transition: `all ${isDraggingSourcePage || isDragging ? 0 : 0.05}s ease`,
            }}>
            <div
              className={`w-full h-full transition-all ${
                isDraggingSourcePage || isDragging ? "scale-[1.02]" : ""
              }`}>
              <div
                className={`relative w-full h-full bg-[#242424] rounded-full pr-[30px] flex justify-center items-center ${
                  isHovering || isHoveringPath ? "border-[2px] border-[#00CD15]" : ""
                }`}>
                <div className="text-white text-[15px] font-[500] tracking-[-0.15px]">
                  <input
                    className="w-full text-center overflow-hidden text-ellipsis whitespace-nowrap bg-transparent"
                    value={content}
                    title={content}
                    placeholder="선택지를 작성해주세요"
                    maxLength={100}
                    onInput={onInputContent}
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>
            <div
              onMouseOver={() => setIsPointHovering(true)}
              onMouseLeave={() => setIsPointHovering(false)}
              className={`absolute w-[20px] h-[20px] rounded-full border-white border-[2px] transition-colors ${
                isEditable && "cursor-pointer"
              } ${
                isEditable && isPointHovering && choice.destinationPageId
                  ? "bg-[#F04438]"
                  : choice.destinationPageId ||
                    (isEditable && isHovering) ||
                    isHoveringPath ||
                    isDraggingPath
                  ? "bg-[#00CD15]"
                  : "bg-[#242424]"
              }`}
              style={{
                left: calcChoicePointOffset().x - (isEditable ? 32 : 0) - 10,
                top: calcChoicePointOffset().y - 10,
              }}
              onMouseDown={handlePointPressed}>
              <div
                className="absolute top-[7px] left-[2px] w-[12px] h-[2px] rounded-full bg-white transtion-all"
                style={{
                  filter: "drop-shadow(0px 1.5px 3px rgba(0, 0, 0, 0.50))",
                  opacity: isEditable && isPointHovering && choice.destinationPageId ? 1 : 0,
                }}></div>
            </div>
          </div>
        </div>
      </DynamicElementLocator>
    </div>
  );
}
