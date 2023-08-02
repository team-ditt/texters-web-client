import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import PageHandle from "@/features/FlowChartEditor/components/PageHandle";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {
  PAGE_CONTENT_HORIZONTAL_MARGIN,
  PAGE_CONTENT_VERTICAL_MARGIN,
  PAGE_POINT_OFFSET_X,
  PAGE_POINT_OFFSET_Y,
} from "@/features/FlowChartEditor/utils/calculator";
import useDebounce from "@/hooks/useDebounce";
import {Page} from "@/types/book";
import {ViewState} from "@/types/flowChartEditor";
import {ReactComponent as MoreVerticalIcon} from "assets/icons/more-vertical.svg";
import {ChangeEvent, useState} from "react";

type Props = {
  viewState: ViewState<Page>;
};

export default function Page({viewState}: Props) {
  const page = viewState.data;
  const elementState = viewState.elementState;
  const pages = useFlowChartEditorStore(state => state.viewStates.pages);
  const choices = useFlowChartEditorStore(state => state.viewStates.choices);
  const lane = useFlowChartEditorStore(state => state.viewStates.lanes[page.laneId]?.data);
  const draggingState = useFlowChartEditorStore(state => state.draggingState);
  const hoveringState = useFlowChartEditorStore(state => state.hoveringState);
  const openedMoreMenuPageId = useFlowChartEditorStore(state => state.openedMoreMenuPageId);
  const updatePageInfo = useFlowChartEditorStore(state => state.updatePageInfo);
  const startHover = useFlowChartEditorStore(state => state.startHover);
  const finishHover = useFlowChartEditorStore(state => state.finishHover);
  const appendChoice = useFlowChartEditorStore(state => state.appendChoice);
  const openPageMoreMenu = useFlowChartEditorStore(state => state.openPageMoreMenu);

  const [title, setTitle] = useState(page.title);
  const onInputTitle = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  useDebounce(
    current => {
      updatePageInfo(page.id, {title: current});
    },
    1500,
    title,
    !title,
  );

  const isDragging = draggingState.isDragging === "page" && draggingState.sourceId === page.id;
  if (!elementState) return null;

  const isIntro = lane?.order === 0;
  const isEnding = !isIntro && page.choices.length === 0;
  const isContentEmpty = page.content === "";
  const hasEmptyChoice = page.choices.some(c => c.destinationPageId === null);
  const isSeparated =
    !isIntro &&
    !Object.keys(pages)
      .map(pageId => parseInt(pageId))
      .filter(pageId => pages[pageId].toPresent)
      .some(pageId =>
        pages[pageId].data.choices.some(choice => choice.destinationPageId === page.id),
      );

  const currentPosition = elementState.box;
  const draggingPositionOffset = isDragging
    ? {
        x: draggingState.current.x - draggingState.offset.x - currentPosition.x,
        y: draggingState.current.y - draggingState.offset.y - currentPosition.y,
      }
    : {
        x: 0,
        y: 0,
      };

  const isHoveringIncomingPath =
    hoveringState.isHovering === "path" &&
    choices[hoveringState.sourceId ?? 0]?.data.destinationPageId === page.id;
  const isHoveringIncomingChoice =
    hoveringState.isHovering === "choice" &&
    choices[hoveringState.sourceId ?? 0]?.data.destinationPageId === page.id;

  const handleAddChoiceButtonClicked = () => {
    appendChoice(page.id);
  };
  const handleHovered = () => {
    startHover("page", page.id);
  };

  return (
    <div onMouseOver={handleHovered} onMouseLeave={finishHover}>
      <DynamicElementLocator zIndex={50}>
        <div
          className="w-full h-full"
          style={{
            transform: `translate(${Math.round(
              currentPosition.x + draggingPositionOffset.x,
            )}px, ${Math.round(currentPosition.y + draggingPositionOffset.y)}px)`,
            transition: `all ${isDragging ? 0 : 0.05}s ease`,
            backgroundColor: "red",
          }}>
          <div
            className={`h-full w-full ${isDragging ? "scale-[1.02]" : ""}`}
            style={{
              transformOrigin: `${elementState.box.width / 2}px ${elementState.box.height / 2}px`,
            }}>
            {!isIntro && <PageHandle pageId={page.id} />}
          </div>
        </div>
      </DynamicElementLocator>
      <DynamicElementLocator zIndex={isDragging ? 6 : 5}>
        <div
          style={{
            position: "absolute",
            transform: `translate(${Math.round(currentPosition.x)}px, ${Math.round(
              currentPosition.y,
            )}px) scale(${elementState.scale})`,
            opacity: elementState.opacity * (isDragging ? 0.8 : 1),
            width: elementState.box.width,
            height: elementState.box.height,
            paddingLeft: 16,
            filter: isDragging ? "blur(1px)" : "none",
          }}>
          <div
            className="w-full h-full"
            style={{
              transform: `translate(${draggingPositionOffset.x}px, ${draggingPositionOffset.y}px)`,
              transition: `all ${isDragging ? 0 : 0.05}s ease`,
            }}>
            <div className={`w-full h-full transition-all ${isDragging ? "scale-[1.02]" : ""}`}>
              <div
                className="relative border-[3px] rounded-[10px] px-[16px] shadow-[0_1px_10px_0_#00000020]"
                style={{
                  borderColor:
                    isHoveringIncomingPath || isHoveringIncomingChoice ? "#00CD15" : "black",
                  background:
                    "var(--back-blur-gradient, linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.00) 100%))",
                  backdropFilter: "blur(1px)",
                  height: `calc(100% - ${PAGE_CONTENT_VERTICAL_MARGIN * 2}px)`,
                  margin: `${PAGE_CONTENT_VERTICAL_MARGIN}px ${PAGE_CONTENT_HORIZONTAL_MARGIN}px`,
                  transition: "all 0.05s ease",
                }}>
                <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 flex flex-wrap gap-[6px]">
                  {isIntro && (
                    <div className="rounded-full px-[20px] py-[4px] bg-[#242424] text-white text-[12px] font-[700] tracking-[-0.6px]">
                      인트로 페이지
                    </div>
                  )}
                  {isEnding && (
                    <div className="rounded-full px-[20px] py-[4px] bg-[#242424] text-white text-[12px] font-[700] tracking-[-0.6px]">
                      엔딩 페이지
                    </div>
                  )}
                  {isContentEmpty && (
                    <div className="rounded-full px-[20px] py-[4px] bg-[#F04438] text-white text-[12px] font-[700] tracking-[-0.6px]">
                      페이지에 내용을 써주세요!
                    </div>
                  )}
                  {isSeparated && (
                    <div className="rounded-full px-[20px] py-[4px] bg-[#F04438] text-white text-[12px] font-[700] tracking-[-0.6px]">
                      페이지가 떨어져 있어요!
                    </div>
                  )}
                  {hasEmptyChoice && (
                    <div className="rounded-full px-[20px] py-[4px] bg-[#F04438] text-white text-[12px] font-[700] tracking-[-0.6px]">
                      선택지를 연결해 주세요!
                    </div>
                  )}
                </div>
                <div className="absolute w-[calc(100%-32px)] h-[52px] flex justify-center items-center border-b-[2px] border-black text-[16px]">
                  <input
                    className="w-[210px] text-center overflow-hidden text-ellipsis whitespace-nowrap bg-transparent"
                    value={title}
                    title={title}
                    placeholder="페이지 제목을 입력해주세요"
                    maxLength={30}
                    onInput={onInputTitle}
                  />
                </div>
                <button
                  onClick={() => openPageMoreMenu(page.id)}
                  className={`absolute top-[14px] right-[16px] ${
                    openedMoreMenuPageId === page.id ? "bg-[#ECECEC] rounded-full" : ""
                  }`}>
                  <MoreVerticalIcon width={22} height={22} />
                </button>
                {!isIntro && (
                  <div
                    className={`absolute w-[20px]  h-[20px] rounded-full border border-[2px] ${
                      isHoveringIncomingPath || isHoveringIncomingChoice
                        ? "border-[#00CD15]"
                        : "border-black"
                    } ${isSeparated ? "bg-transparent" : "bg-[#00CD15]"}`}
                    style={{
                      left: PAGE_POINT_OFFSET_X,
                      top: PAGE_POINT_OFFSET_Y,
                    }}></div>
                )}
                {page.choices.length < 5 && (
                  <button
                    className="absolute text-sm right-0.5 bottom-5 w-full flex justify-center items-center gap-[4px]"
                    onClick={handleAddChoiceButtonClicked}>
                    <div className="relative w-[17px] h-[17px] rounded-full border-[2px] border-[#A5A5A5]">
                      <div className="w-full h-full p-[2.5px] flex justify-center items-center">
                        <div className="w-full h-[2px] rounded-full bg-[#A5A5A5]"></div>
                      </div>
                      <div className="absolute top-0 w-full h-full p-[2.5px] flex justify-center items-center">
                        <div className="w-full h-[2px] rounded-full bg-[#A5A5A5] rotate-90"></div>
                      </div>
                    </div>
                    <div className="text-[#A5A5A5] text-[12px] font-[700] tracking-[-0.6px]">
                      선택지 추가하기
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DynamicElementLocator>
    </div>
  );
}