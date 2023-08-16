import {useEffect, useRef} from "react";

import Choice from "@/features/FlowChartEditor/components/Choice";
import DraggingChoicePlaceholder from "@/features/FlowChartEditor/components/DraggingChoicePlaceholder";
import DraggingPagePlaceholder from "@/features/FlowChartEditor/components/DraggingPagePlaceholder";
import Lane from "@/features/FlowChartEditor/components/Lane";
import NewLaneButton from "@/features/FlowChartEditor/components/NewLaneButton";
import NewLanePageButton from "@/features/FlowChartEditor/components/NewLanePageButton";
import NewPageButton from "@/features/FlowChartEditor/components/NewPageButton";
import Page from "@/features/FlowChartEditor/components/Page";
import PageMoreMenu from "@/features/FlowChartEditor/components/PageMoreMenu";
import Path from "@/features/FlowChartEditor/components/Path";
import ScrollBar from "@/features/FlowChartEditor/components/ScrollBar";
import useMousePosition from "@/features/FlowChartEditor/hooks/useMousePosition";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";

export default function FlowChartEditor() {
  const viewStates = useFlowChartEditorStore(state => state.viewStates);
  const updateDrag = useFlowChartEditorStore(state => state.updateDrag);
  const setFrameSize = useFlowChartEditorStore(state => state.setFrameSize);
  const scrollViewPort = useFlowChartEditorStore(state => state.scrollViewPort);

  const frameRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (useFlowChartEditorStore.getState().draggingState.isDragging !== null)
        event.preventDefault();
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    const frameElement = frameRef.current;
    if (!frameElement) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setFrameSize({
          width: entry.contentBoxSize[0].inlineSize,
          height: entry.contentBoxSize[0].blockSize,
        });
      }
    });
    resizeObserver.observe(frameElement);
    return () => {
      resizeObserver.disconnect();
    };
  }, [frameRef.current]);

  useEffect(() => {
    const frameElement = frameRef.current;
    if (!frameElement) return;
    const {top, left} = frameElement.getBoundingClientRect();
    const {offset, frameSize} = useFlowChartEditorStore.getState().viewPortState;

    updateDrag({
      x: mousePosition.x - left + offset.x,
      y: mousePosition.y - top - frameSize.height / 2 + offset.y,
    });
  }, [mousePosition]);

  const handleWheel = (event: React.WheelEvent) => {
    scrollViewPort(
      event.shiftKey
        ? {
            x: event.deltaY,
            y: event.deltaX,
          }
        : {
            x: event.deltaX,
            y: event.deltaY,
          },
    );
  };

  const laneViewStates = [];
  for (let laneId in viewStates.lanes) {
    const lane = viewStates.lanes[laneId];
    if (lane.visibility !== "hidden") laneViewStates.push(lane);
  }
  laneViewStates.sort((a, b) => b.data.order - a.data.order);
  const pageViewStates = [];
  for (let pageId in viewStates.pages) {
    const page = viewStates.pages[pageId];
    if (page.visibility !== "hidden") pageViewStates.push(page);
  }
  pageViewStates.sort((a, b) => a.data.id - b.data.id);
  const choiceViewStates = [];
  for (let choiceId in viewStates.choices) {
    const choice = viewStates.choices[choiceId];
    if (choice.visibility !== "hidden") choiceViewStates.push(choice);
  }
  choiceViewStates.sort((a, b) => a.data.id - b.data.id);

  return (
    <div
      className="w-full h-full bg-[#FFFFFF]"
      ref={frameRef}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
      onWheel={handleWheel}>
      {laneViewStates.map(viewState => (
        <Lane key={viewState.data.id} viewState={viewState} />
      ))}
      {choiceViewStates.map(viewState => (
        <Path
          key={viewState.data.id}
          sourcePageId={viewState.data.sourcePageId}
          sourceChoiceId={viewState.data.id}
          destinationPageId={viewState.data.destinationPageId}
        />
      ))}
      <DraggingPagePlaceholder />
      {pageViewStates.map(viewState => (
        <Page key={viewState.data.id} viewState={viewState} />
      ))}
      <DraggingChoicePlaceholder />
      {choiceViewStates.map(viewState => (
        <Choice key={viewState.data.id} viewState={viewState} />
      ))}
      <NewPageButton />
      <NewLaneButton />
      <NewLanePageButton />
      <ScrollBar />
      <PageMoreMenu />
    </div>
  );
}
