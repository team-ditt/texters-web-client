import useRequestAnimationFrame from "@/features/FlowChartEditor/hooks/useRequestAnimationFrame";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {
  PAGE_WIDTH,
  calcChoiceBox,
  calcElementBoxesModel,
  calcPagePointOffset,
  contains,
  findOrder,
} from "@/features/FlowChartEditor/utils/calculator";
import {Choice, Page} from "@/types/book";
import {useEffect} from "react";

export default function useFlowChartEditor() {
  const setViewLanes = useFlowChartEditorStore(state => state.setViewLanes);
  const updateTransitions = useFlowChartEditorStore(state => state.updateTransitions);
  const finishDrag = useFlowChartEditorStore(state => state.finishDrag);
  const showNewPageButton = useFlowChartEditorStore(state => state.showNewPageButton);
  const hideNewPageButton = useFlowChartEditorStore(state => state.hideNewPageButton);
  const showNewLanePageButton = useFlowChartEditorStore(state => state.showNewLanePageButton);
  const hideNewLanePageButton = useFlowChartEditorStore(state => state.hideNewLanePageButton);
  const showNewLaneButton = useFlowChartEditorStore(state => state.showNewLaneButton);
  const hideNewLaneButton = useFlowChartEditorStore(state => state.hideNewLaneButton);

  /* update element transtisions on request anim frame */
  useRequestAnimationFrame(updateTransitions);

  /* finish drag on mouse up*/
  useEffect(() => {
    window.addEventListener("mouseup", finishDrag);
    return () => window.removeEventListener("mouseup", finishDrag);
  }, []);

  /* update view states by model lanes update */
  useEffect(
    () =>
      useFlowChartEditorStore.subscribe(
        state => state.modelLanes,
        lanes => {
          setViewLanes(lanes);
        },
        {fireImmediately: true},
      ),
    [],
  );

  /* move dragging page by mouse position */
  useEffect(
    () =>
      useFlowChartEditorStore.subscribe(
        state => state.draggingState,
        draggingState => {
          if (!useFlowChartEditorStore.getState().isEditable()) return;
          if (draggingState.isDragging !== "page" || draggingState.sourceId === null) return;
          const draggingPageId = draggingState.sourceId;

          const state = useFlowChartEditorStore.getState();

          const lanes = state.modelLanes.map(l => ({
            ...l,
            pages: l.pages.map(p => ({...p})),
          }));

          const draggingBox = {
            ...state.viewStates.pages[draggingPageId].elementState!.box,
            x: draggingState.current.x - draggingState.offset.x,
            y: draggingState.current.y - draggingState.offset.y,
          };
          const draggingCenter = {
            x: draggingBox.x + draggingBox.width / 2,
            y: draggingBox.y + draggingBox.height / 2,
          };
          const draggingIndex = findOrder(lanes, draggingPageId);
          const draggingPage = lanes[draggingIndex[0]].pages.splice(draggingIndex[1], 1)[0];
          const {pages: pageBoxes} = calcElementBoxesModel(lanes);

          let inserted = false;
          for (let laneOrder = 1; laneOrder < lanes.length; ++laneOrder) {
            if (inserted) break;
            const lane = lanes[laneOrder];
            if (
              (laneOrder !== 1 && draggingCenter.x < PAGE_WIDTH * laneOrder) ||
              (laneOrder !== lanes.length - 1 && PAGE_WIDTH * (laneOrder + 1) < draggingCenter.x)
            ) {
              continue;
            }

            for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
              const page = lane.pages[pageOrder];
              const pageBox = pageBoxes[page.id];
              if (draggingCenter.y < pageBox.y || pageBox.y + pageBox.height < draggingCenter.y)
                continue;
              if (draggingCenter.y < pageBox.y + pageBox.height / 2) {
                lane.pages.splice(pageOrder, 0, draggingPage);
              } else {
                lane.pages.splice(pageOrder + 1, 0, draggingPage);
              }
              lane.pages[pageOrder].order += 1;
              inserted = true;
              break;
            }

            if (inserted) break;
            if (draggingCenter.y < 0) {
              lane.pages.splice(0, 0, draggingPage);
            } else {
              lane.pages.splice(lane.pages.length, 0, draggingPage);
            }
            inserted = true;
            break;
          }
          if (!inserted) lanes[draggingIndex[0]].pages.splice(draggingIndex[1], 0, draggingPage);

          for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
            const lane = lanes[laneOrder];
            for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
              const page = lane.pages[pageOrder];
              page.order = pageOrder;
            }
          }
          setViewLanes(lanes);
        },
      ),
    [],
  );

  /* move dragging choice by mouse position */
  useEffect(
    () =>
      useFlowChartEditorStore.subscribe(
        state => state.draggingState,
        draggingState => {
          if (!useFlowChartEditorStore.getState().isEditable()) return;
          if (draggingState.isDragging !== "choice" || draggingState.sourceId === null) return;
          const draggingChoiceId = draggingState.sourceId;

          const state = useFlowChartEditorStore.getState();
          const lanes = state.modelLanes.map(l => ({
            ...l,
            pages: l.pages.map(p => ({...p, choices: p.choices.map(c => ({...c}))})),
          }));
          const choice = state.viewStates.choices[draggingChoiceId].data;

          let page: Page | undefined;
          for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
            const lane = lanes[laneOrder];
            for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
              if (lane.pages[pageOrder].id === choice.sourcePageId) {
                page = lane.pages[pageOrder];
                break;
              }
            }
            if (page) break;
          }
          if (!page) return;

          const draggingBox = {
            ...state.viewStates.choices[draggingChoiceId].elementState!.box,
            x: draggingState.current.x - draggingState.offset.x,
            y: draggingState.current.y - draggingState.offset.y,
          };
          const draggingCenter = {
            x: draggingBox.x + draggingBox.width / 2,
            y: draggingBox.y + draggingBox.height / 2,
          };

          const {pages: pageBoxes} = calcElementBoxesModel(lanes);
          const pageBox = pageBoxes[choice.sourcePageId];
          const newChoices = page.choices.filter(c => c.id !== choice.id);
          const divisions = page.choices.map((c, o) => ({
            order: c.order,
            box: calcChoiceBox(pageBox, o),
          }));

          let newOrder = 0;
          for (let i = 0; i < divisions.length; ++i) {
            if (divisions[i].box!.y <= draggingCenter.y) {
              newOrder = divisions[i].order;
            }
          }
          newChoices.splice(newOrder, 0, choice);
          page.choices = newChoices.map((c, o) => ({...c, order: o}));

          setViewLanes(lanes);
        },
      ),
    [],
  );

  /* move dragging path by mouse position */
  useEffect(
    () =>
      useFlowChartEditorStore.subscribe(
        state => state.draggingState,
        draggingState => {
          if (!useFlowChartEditorStore.getState().isEditable()) return;
          if (draggingState.isDragging !== "path") return;
          const sourceChoiceId = draggingState.sourceId;

          const state = useFlowChartEditorStore.getState();
          const lanes = state.modelLanes.map(l => ({
            ...l,
            pages: l.pages.map(p => ({...p, choices: p.choices.map(c => ({...c}))})),
          }));

          let choice: Choice | undefined;
          let choiceLaneOrder = -1;
          for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
            const lane = lanes[laneOrder];
            for (let page of lane.pages) {
              for (let c of page.choices) {
                if (c.id === sourceChoiceId) {
                  choice = c;
                  choiceLaneOrder = laneOrder;
                  break;
                }
              }
              if (choice) break;
            }
            if (choice) break;
          }
          if (!choice) return;

          const draggingPosition = {
            x: draggingState.current.x - draggingState.offset.x,
            y: draggingState.current.y - draggingState.offset.y,
          };

          const {pages: pageBoxes} = calcElementBoxesModel(lanes);
          for (let laneOrder = choiceLaneOrder + 1; laneOrder < lanes.length; ++laneOrder) {
            const lane = lanes[laneOrder];
            for (let page of lane.pages) {
              const pageBox = pageBoxes[page.id];
              if (!pageBox) continue;
              const pagePointOffset = calcPagePointOffset();
              const size = 64;
              const pagePointBox = {
                x: pageBox.x + pagePointOffset.x - size / 2,
                y: pageBox.y + pagePointOffset.y - size / 2,
                width: size,
                height: size,
              };
              if (contains(pagePointBox, draggingPosition)) {
                choice.destinationPageId = page.id;
                setViewLanes(lanes);
                return;
              }
            }
          }

          choice.destinationPageId = null;
          setViewLanes(lanes);
        },
      ),
    [],
  );

  /* show new page button on hover between pages */
  useEffect(
    () =>
      useFlowChartEditorStore.subscribe(
        state => state.draggingState,
        draggingState => {
          if (!useFlowChartEditorStore.getState().isEditable()) return;
          if (draggingState.isDragging) return;
          if (useFlowChartEditorStore.getState().viewStates.newLaneButton.toPresent) return;
          if (useFlowChartEditorStore.getState().openedMoreMenuPageId !== null) return;

          const lanes = useFlowChartEditorStore.getState().modelLanes;
          const dragPosition = draggingState.current;
          const {pages: pageBoxes} = calcElementBoxesModel(lanes);
          if (lanes.length === 1 && dragPosition.x >= PAGE_WIDTH) {
            showNewLanePageButton(1);
            return;
          }
          for (let laneOrder = 1; laneOrder < lanes.length; ++laneOrder) {
            const lane = lanes[laneOrder];
            if (laneOrder === lanes.length - 1 && PAGE_WIDTH * lanes.length <= dragPosition.x) {
              showNewLanePageButton(lanes.length);
              return;
            }

            if (
              dragPosition.x < PAGE_WIDTH * laneOrder ||
              PAGE_WIDTH * (laneOrder + 1) < dragPosition.x
            )
              continue;

            if (lane.pages.length === 0) {
              showNewLanePageButton(laneOrder);
              return;
            }

            for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
              const page = lane.pages[pageOrder];
              const pageBox = pageBoxes[page.id];
              const topLine = pageBox.y;
              if (
                topLine - (pageOrder === 0 ? 48 : 0) <= dragPosition.y &&
                dragPosition.y <= topLine + 16
              ) {
                showNewPageButton(laneOrder, pageOrder);
                return;
              }
              const bottomLine = pageBox.y + pageBox.height;
              if (
                bottomLine - 48 <= dragPosition.y &&
                dragPosition.y <= bottomLine + (pageOrder === lane.pages.length - 1 ? 16 : 0)
              ) {
                showNewPageButton(laneOrder, pageOrder + 1);
                return;
              }
            }
          }
          hideNewPageButton();
          hideNewLanePageButton();
        },
      ),
    [],
  );

  /* show new lane button on hover between lanes */
  useEffect(
    () =>
      useFlowChartEditorStore.subscribe(
        state => state.draggingState,
        draggingState => {
          if (!useFlowChartEditorStore.getState().isEditable()) return;
          if (draggingState.isDragging) return;
          if (useFlowChartEditorStore.getState().openedMoreMenuPageId !== null) return;

          const lanes = useFlowChartEditorStore.getState().modelLanes;
          const dragPosition = draggingState.current;
          for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
            const rightLine = PAGE_WIDTH * (laneOrder + 1);
            if (rightLine - 16 <= dragPosition.x && dragPosition.x <= rightLine + 16) {
              showNewLaneButton(laneOrder);
              return;
            }
          }
          hideNewLaneButton();
        },
      ),
    [],
  );
}
