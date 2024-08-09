// import useIdProviderStore from "@/features/FlowChartEditor/stores/useIdProviderStore";
import {
  calcCurrentState,
  calcDynamicElementBoxes,
  calcStaticElementBoxes,
  findOrder,
  isSameBox,
} from "@/features/FlowChartEditor/utils/calculator";
// import {useFlowChartStore} from "@/stores";
import useFlowChartListStore from "@/stores/useFlowChartListStore";
import {Choice, FlowChart, Lane, Page} from "@/types/book";
import {
  Action,
  Box,
  Coordinate,
  DraggingState,
  HoveringState,
  HoveringTargetType,
  Size,
  ViewPortState,
  ViewState,
  ViewStates,
} from "@/types/flowChartEditor";
import {create} from "zustand";
import {subscribeWithSelector} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";

// const idProvider = () => useIdProviderStore.getState();

type FlowChartStoreState = {
  bookId: number | null;
  isReadOnly: boolean;
  modelLanes: Lane[];
  viewStates: ViewStates;
  draggingState: DraggingState;
  hoveringState: HoveringState;
  viewPortState: ViewPortState;
  actionQueue: Action[];
  openedMoreMenuPageId: number | null;
};

type FlowChartStoreAction = {
  loadFlowChart: (flowChart: FlowChart) => void;
  clearFlowChart: () => void;
  setModelLanes: (lanes: Lane[]) => void;
  setViewLanes: (lanes: Lane[]) => void;
  invalidateViewStates: () => void;
  updateTransitions: () => void;
  startDragPage: (pageId: number, offset: Coordinate) => void;
  startDragChoice: (choiceId: number, offset: Coordinate) => void;
  startDragPath: (choiceId: number) => void;
  updateDrag: (position: Coordinate) => void;
  finishDrag: () => void;
  startHover: (targetType: HoveringTargetType, sourceId: number) => void;
  finishHover: () => void;
  showNewLaneButton: (laneOrder: number) => void;
  hideNewLaneButton: () => void;
  showNewPageButton: (laneOrder: number, pageOrder: number) => void;
  hideNewPageButton: () => void;
  showNewLanePageButton: (laneOrder: number) => void;
  hideNewLanePageButton: () => void;
  insertNewLane: (laneOrder: number) => Lane | undefined;
  deleteLane: (laneId: number) => void;
  insertNewPage: (laneOrder: number, pageOrder: number) => Page | undefined;
  updatePageInfo: (pageId: number, info: {title?: string; content?: string | null}) => void;
  loadPageTitle: (realPageId: number, title: string) => void;
  loadPageContent: (realPageId: number, content: string) => void;
  movePage: (pageId: number, laneId: number, pageOrder: number) => void;
  deletePage: (pageId: number) => void;
  openPageMoreMenu: (pageId: number) => void;
  closePageMoreMenu: () => void;
  appendChoice: (pageId: number) => void;
  updateChoiceContent: (choiceId: number, content: string | null) => void;
  loadNewChoice: (realPageId: number, realChoiceId: number, content: string) => void;
  loadChoiceOrder: (realChoiceId: number, order: number) => void;
  loadChoiceContent: (realChoiceId: number, content: string) => void;
  loadChoiceDestination: (realChoiceId: number, destinationPageId: number | null) => void;
  unloadChoice: (realChoiceId: number) => void;
  moveChoice: (choiceId: number, choiceOrder: number) => void;
  setChoiceDestination: (choiceId: number, destinationPageId: number | null) => void;
  deleteChoice: (choiceId: number) => void;
  setFrameSize: (size: Size) => void;
  scrollViewPort: (offset: Coordinate) => void;
  // pushAction: (runnable: () => Promise<any>) => void;
  // updateActionQueue: () => void;
  commitModelLanes: () => void;
};

const emptyViewState = <T>(data: T, toPresent: boolean = true): ViewState<T> => ({
  data,
  toPresent,
  visibility: "hidden",
  elementState: null,
  transition: null,
});

const deepCopyLanes = (lanes: Lane[]) =>
  lanes.map(lane => ({
    ...lane,
    pages: lane.pages.map(page => ({
      ...page,
      choices: page.choices.map(choice => ({...choice})),
    })),
  }));

const useFlowChartEditorStore = create<FlowChartStoreState & FlowChartStoreAction>()(
  subscribeWithSelector(
    immer((set, get) => {
      return {
        bookId: null,
        isReadOnly: false,
        modelLanes: [],
        viewStates: {
          lanes: {},
          pages: {},
          choices: {},
          newPageButton: emptyViewState({laneOrder: -1, pageOrder: -1}, false),
          newLanePageButton: emptyViewState({laneOrder: -1}, false),
          newLaneButton: emptyViewState({laneOrder: -1}, false),
        },
        draggingState: {
          isDragging: null,
          sourceId: null,
          offset: {x: 0, y: 0},
          current: {x: 0, y: 0},
        },
        hoveringState: {
          isHovering: null,
          sourceId: null,
        },
        viewPortState: {
          offset: {x: 0, y: 0},
          scale: 1,
          frameSize: {width: 0, height: 0},
          contentSize: {width: 0, height: 0},
        },
        actionQueue: [],
        openedMoreMenuPageId: null,
        loadFlowChart: flowChart => {
          get().clearFlowChart();
          set({bookId: flowChart.id, isReadOnly: !!flowChart.sourceUrl});
          const lanes = deepCopyLanes(flowChart.lanes);
          // get().setModelLanes(idProvider().convertFlowChart(lanes));
          get().setModelLanes(lanes);
        },
        clearFlowChart: () => {
          set(state => ({
            bookId: null,
            bookStatus: null,
            modelLanes: [],
            viewStates: {
              lanes: {},
              pages: {},
              choices: {},
              newPageButton: emptyViewState({laneOrder: -1, pageOrder: -1}, false),
              newLanePageButton: emptyViewState({laneOrder: -1}, false),
              newLaneButton: emptyViewState({laneOrder: -1}, false),
            },
            draggingState: {
              isDragging: null,
              sourceId: null,
              offset: {x: 0, y: 0},
              current: {x: 0, y: 0},
            },
            hoveringState: {
              isHovering: null,
              sourceId: null,
            },
            viewPortState: {
              offset: {x: 0, y: 0},
              scale: 1,
              frameSize: state.viewPortState.frameSize,
              contentSize: {width: 2160, height: 1440},
            },
            actionQueue: [],
            openedMoreMenuPageId: null,
          }));
        },
        setModelLanes: lanes => {
          set(state => {
            state.modelLanes = [];
            for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
              const lane = lanes[laneOrder];
              const newLane: Lane = {
                ...lane,
                pages: [],
                order: laneOrder,
              };
              for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
                const page = lane.pages[pageOrder];
                const newPage: Page = {
                  ...page,
                  choices: [],
                  order: pageOrder,
                };
                for (let choiceOrder = 0; choiceOrder < page.choices.length; ++choiceOrder) {
                  const choice = page.choices[choiceOrder];
                  const newChoice: Choice = {
                    ...choice,
                    order: choiceOrder,
                  };
                  newPage.choices.push(newChoice);
                }
                newLane.pages.push(newPage);
              }
              state.modelLanes.push(newLane);
            }
          });
        },
        setViewLanes: lanes => {
          set(state => {
            const viewStates = state.viewStates;
            for (let laneId in viewStates.lanes) viewStates.lanes[laneId].toPresent = false;
            for (let pageId in viewStates.pages) viewStates.pages[pageId].toPresent = false;
            for (let choiceId in viewStates.choices) viewStates.choices[choiceId].toPresent = false;

            for (let lane of lanes) {
              let laneState = viewStates.lanes[lane.id];
              if (!laneState) {
                laneState = emptyViewState(lane);
                viewStates.lanes[lane.id] = laneState;
              } else {
                laneState.data = lane;
                laneState.toPresent = true;
              }

              for (let page of lane.pages) {
                let pageState = viewStates.pages[page.id];
                if (!pageState) {
                  pageState = emptyViewState(page);
                  viewStates.pages[page.id] = pageState;
                } else {
                  pageState.data = page;
                  pageState.toPresent = true;
                }

                for (let choice of page.choices) {
                  let choiceState = viewStates.choices[choice.id];
                  if (!choiceState) {
                    choiceState = emptyViewState(choice);
                    viewStates.choices[choice.id] = choiceState;
                  } else {
                    choiceState.data = choice;
                    choiceState.toPresent = true;
                  }
                }
              }
            }
          });
          get().invalidateViewStates();
        },
        invalidateViewStates: () => {
          set(state => {
            const viewStates = state.viewStates;
            const staticBoxes = calcStaticElementBoxes(viewStates, state.viewPortState.frameSize);
            const dynamicBoxes = calcDynamicElementBoxes(viewStates, state.viewPortState.frameSize);
            state.viewPortState.contentSize = dynamicBoxes.contentSize;
            const timestamp = Date.now();

            const update = (viewState: ViewState<any>, box?: Box) => {
              const transition = viewState.transition;
              const elementState = viewState.elementState;
              if (
                box &&
                viewState.toPresent &&
                (viewState.visibility === "hidden" || viewState.visibility === "hiding")
              ) {
                if (!viewState.elementState)
                  viewState.elementState = {
                    opacity: 0,
                    scale: 0.9,
                    box,
                  };
                viewState.visibility = "showing";
                viewState.transition = {
                  src: viewState.elementState,
                  dst: {
                    opacity: 1,
                    scale: 1,
                    box,
                  },
                  startTimestamp: timestamp,
                  duration: 150,
                };
              } else if (
                !viewState.toPresent &&
                elementState &&
                (viewState.visibility === "showing" || viewState.visibility === "present")
              ) {
                viewState.visibility = "hiding";
                viewState.transition = {
                  src: elementState,
                  dst: {
                    opacity: 0,
                    scale: 0.9,
                    box: transition?.dst.box ?? elementState.box,
                  },
                  startTimestamp: timestamp,
                  duration: 150,
                };
              } else if (transition && box && isSameBox(transition.dst.box, box)) return;
              else if (box && elementState && isSameBox(elementState.box, box)) return;
              else if (box && elementState) {
                viewState.transition = {
                  src: elementState,
                  dst: {
                    ...(transition?.dst ?? elementState),
                    box,
                  },
                  startTimestamp: timestamp,
                  duration: 150,
                };
              }
            };

            for (let laneId in viewStates.lanes)
              update(viewStates.lanes[laneId], staticBoxes.lanes[laneId]);
            for (let pageId in viewStates.pages)
              update(viewStates.pages[pageId], dynamicBoxes.pages[pageId]);
            for (let choiceId in viewStates.choices)
              update(viewStates.choices[choiceId], dynamicBoxes.choices[choiceId]);
            update(viewStates.newPageButton, dynamicBoxes.newPageButton);
            update(viewStates.newLanePageButton, dynamicBoxes.newLanePageButton);
            update(viewStates.newLaneButton, staticBoxes.newLaneButton);
          });
        },
        updateTransitions: () => {
          set(state => {
            const timestamp = Date.now();
            const viewStates = state.viewStates;

            const update = (viewState: ViewState<any>) => {
              const transition = viewState.transition;
              if (!transition) return;
              const {progress, current} = calcCurrentState(transition, timestamp);
              if (progress >= 1) {
                if (viewState.visibility === "hiding") viewState.visibility = "hidden";
                if (viewState.visibility === "showing") viewState.visibility = "present";
                viewState.transition = null;
              }
              viewState.elementState = viewState.visibility === "hidden" ? null : current;
            };

            for (let laneId in viewStates.lanes) {
              update(viewStates.lanes[laneId]);
            }
            for (let pageId in viewStates.pages) {
              update(viewStates.pages[pageId]);
            }
            for (let choiceId in viewStates.choices) {
              update(viewStates.choices[choiceId]);
            }
            update(viewStates.newPageButton);
            update(viewStates.newLanePageButton);
            update(viewStates.newLaneButton);
          });
        },
        startDragPage: (pageId, offset) => {
          set(state => {
            state.draggingState.isDragging = "page";
            state.draggingState.sourceId = pageId;
            state.draggingState.offset = offset;
          });
          get().hideNewLaneButton();
          get().hideNewPageButton();
          get().hideNewLanePageButton();
        },
        startDragChoice: (choiceId, offset) => {
          set(state => {
            state.draggingState.isDragging = "choice";
            state.draggingState.sourceId = choiceId;
            state.draggingState.offset = offset;
          });
          get().hideNewLaneButton();
          get().hideNewPageButton();
          get().hideNewLanePageButton();
          get().finishHover();
        },
        startDragPath: choiceId => {
          set(state => {
            state.draggingState.isDragging = "path";
            state.draggingState.sourceId = choiceId;
          });
          get().finishHover();
        },
        updateDrag: position => {
          set(state => {
            state.draggingState.current = position;
          });
        },
        finishDrag: () => {
          const draggingState = get().draggingState;
          if (draggingState.sourceId) {
            if (draggingState.isDragging === "page") {
              const pageId = draggingState.sourceId;
              const laneId = parseInt(
                Object.keys(get().viewStates.lanes).find(laneId =>
                  get().viewStates.lanes[parseInt(laneId)].data.pages.some(p => p.id === pageId),
                )!,
              );
              const pageOrder = get().viewStates.pages[pageId].data.order;
              get().movePage(pageId, laneId, pageOrder);
            } else if (draggingState.isDragging === "choice") {
              const choiceId = draggingState.sourceId;
              const choiceOrder = get().viewStates.choices[choiceId].data.order;
              get().moveChoice(choiceId, choiceOrder);
            } else if (draggingState.isDragging === "path") {
              const choiceId = draggingState.sourceId;
              const destinationPageId = get().viewStates.choices[choiceId].data.destinationPageId;
              get().setChoiceDestination(choiceId, destinationPageId);
            }
          }
          set(state => {
            state.draggingState.isDragging = null;
            state.draggingState.sourceId = -1;
            state.draggingState.offset = {x: 0, y: 0};
          });
        },
        startHover: (targetType, sourceId) => {
          if (get().draggingState.isDragging !== null) return;
          set(state => {
            state.hoveringState.isHovering = targetType;
            state.hoveringState.sourceId = sourceId;
          });
        },
        finishHover: () => {
          set(state => {
            state.hoveringState.isHovering = null;
            state.hoveringState.sourceId = -1;
          });
        },
        showNewLaneButton: laneOrder => {
          const newLaneButton = get().viewStates.newLaneButton;
          if (newLaneButton.data.laneOrder === laneOrder && newLaneButton.toPresent === true)
            return;
          set(state => {
            state.viewStates.newLaneButton.data = {laneOrder};
            state.viewStates.newLaneButton.toPresent = true;
          });
          get().hideNewPageButton();
          get().hideNewLanePageButton();
          get().invalidateViewStates();
        },
        hideNewLaneButton: () => {
          if (get().viewStates.newLaneButton.toPresent === false) return;
          set(state => {
            state.viewStates.newLaneButton.toPresent = false;
          });
          get().invalidateViewStates();
        },
        showNewPageButton: (laneOrder, pageOrder) => {
          const newPageButton = get().viewStates.newPageButton;
          if (
            newPageButton.data.laneOrder === laneOrder &&
            newPageButton.data.pageOrder === pageOrder &&
            newPageButton.toPresent === true
          )
            return;
          set(state => {
            state.viewStates.newPageButton.data = {
              laneOrder,
              pageOrder,
            };
            state.viewStates.newPageButton.toPresent = true;
          });
          get().invalidateViewStates();
        },
        hideNewPageButton: () => {
          if (get().viewStates.newPageButton.toPresent === false) return;
          set(state => {
            state.viewStates.newPageButton.toPresent = false;
          });
          get().invalidateViewStates();
        },
        showNewLanePageButton: laneOrder => {
          const newLanePageButton = get().viewStates.newLanePageButton;
          if (
            newLanePageButton.data.laneOrder === laneOrder &&
            newLanePageButton.toPresent === true
          )
            return;
          set(state => {
            state.viewStates.newLanePageButton.data = {
              laneOrder,
            };
            state.viewStates.newLanePageButton.toPresent = true;
          });
          get().invalidateViewStates();
        },
        hideNewLanePageButton: () => {
          if (get().viewStates.newLanePageButton.toPresent === false) return;
          set(state => {
            state.viewStates.newLanePageButton.toPresent = false;
          });
          get().invalidateViewStates();
        },
        insertNewLane: laneOrder => {
          const bookId = get().bookId;
          if (!bookId) return;
          // const newId = idProvider().generateNewFakeId();
          const newId = useFlowChartListStore.getState().getNextId();
          // get().pushAction(() =>
          //   useFlowChartStore
          //     .getState()
          //     .createLane({
          //       bookId,
          //       order: laneOrder,
          //     })
          //     .then(lane => idProvider().register("lane", newId, lane.id)),
          // );
          const newLane: Lane = {
            bookId,
            id: newId,
            order: laneOrder,
            pages: [],
          };
          set(state => {
            state.modelLanes.splice(laneOrder, 0, newLane);
            state.modelLanes = state.modelLanes.map((l, o) => ({...l, order: o}));
          });
          get().commitModelLanes();
          return newLane;
        },
        deleteLane: laneId => {
          const bookId = get().bookId;
          if (!bookId) return;
          // get().pushAction(() =>
          //   useFlowChartStore
          //     .getState()
          //     .deleteLane({bookId, laneId: idProvider().getRealId(laneId)!}),
          // );
          set(state => {
            const laneIndex = state.modelLanes.findIndex(l => l.id === laneId);
            if (laneIndex !== -1) {
              state.modelLanes.splice(laneIndex, 1);
            }
            state.modelLanes = state.modelLanes.map((l, o) => ({...l, order: o}));
          });
          get().commitModelLanes();
          get().hideNewLaneButton();
          get().hideNewPageButton();
          get().hideNewLanePageButton();
        },
        insertNewPage: (laneOrder, pageOrder) => {
          pageOrder = Math.max(0, pageOrder);
          const bookId = get().bookId;
          if (!bookId) return;
          const lane = get().modelLanes[laneOrder] ?? get().insertNewLane(laneOrder);
          // const newId = idProvider().generateNewFakeId();
          const newId = useFlowChartListStore.getState().getNextId();
          // get().pushAction(() =>
          //   useFlowChartStore
          //     .getState()
          //     .createPage({
          //       bookId,
          //       laneId: idProvider().getRealId(lane.id)!,
          //       title: "페이지 제목을 입력해주세요",
          //       order: pageOrder,
          //     })
          //     .then(page => idProvider().register("page", newId, page.id)),
          // );
          const newPage: Page = {
            bookId,
            id: newId,
            laneId: lane.id,
            order: pageOrder,
            title: `페이지 제목을 입력해주세요`,
            content: "",
            // createdAt: "",
            // updatedAt: "",
            choices: [],
            isIntro: false,
          };
          set(state => {
            const lane = state.modelLanes[laneOrder];
            lane.pages.splice(pageOrder, 0, newPage);
            lane.pages = lane.pages.map((p, o) => ({
              ...p,
              order: o,
            }));
          });
          get().commitModelLanes();
          get().hideNewPageButton();
          get().hideNewLanePageButton();
          return newPage;
        },
        updatePageInfo: (pageId, {title, content}) => {
          const bookId = get().bookId;
          if (!bookId) return;
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              if (pageId === page.id) {
                if (title !== undefined) page.title = title;
                if (content !== undefined) page.content = content;
              }
            }
          }
          get().setModelLanes(lanes);
          // const realPageId = idProvider().getRealId(pageId)!;
          // get().pushAction(() =>
          //   useFlowChartStore
          //     .getState()
          //     .updatePageInfo({bookId, pageId: realPageId, title, content}),
          // );
          get().commitModelLanes();
        },
        loadPageTitle: (realPageId, title) => {
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              if (realPageId === page.id) {
                page.title = title;
              }
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
        },
        loadPageContent: (realPageId, content) => {
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              if (realPageId === page.id) {
                page.content = content;
              }
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
        },
        movePage: (pageId, laneId, pageOrder) => {
          const bookId = get().bookId;
          if (!bookId) return;
          const lanes = deepCopyLanes(get().modelLanes);
          const newIndex = [get().viewStates.lanes[laneId].data.order, pageOrder];
          const oldIndex = findOrder(lanes, pageId);
          const page = lanes[oldIndex[0]].pages.splice(oldIndex[1], 1)[0];
          lanes[newIndex[0]].pages.splice(newIndex[1], 0, {
            ...page,
            laneId,
          });
          const pageLaneOrder: {[key: number]: number} = {};
          for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
            const lane = lanes[laneOrder];
            lane.order = laneOrder;
            for (let pageIndex = 0; pageIndex < lane.pages.length; ++pageIndex) {
              const page = lane.pages[pageIndex];
              page.order = pageIndex;
              pageLaneOrder[page.id] = laneOrder;
            }
          }
          // get().pushAction(() =>
          //   useFlowChartStore.getState().updatePageOrder({
          //     bookId,
          //     laneId: laneId!,
          //     pageId: pageId!,
          //     order: pageOrder,
          //   }),
          // );
          set(state => {
            state.modelLanes = lanes;
          });
          get().commitModelLanes();
        },
        deletePage: pageId => {
          const bookId = get().bookId;
          if (!bookId) return;
          // get().pushAction(() =>
          //   useFlowChartStore.getState().deletePage({bookId, pageId: pageId!}),
          // );
          set(state => {
            const lane = state.modelLanes.find(lane => lane.pages.some(p => p.id === pageId));
            if (!lane) return;
            const pageIndex = lane.pages.findIndex(p => p.id === pageId);
            if (pageIndex === -1) return;
            lane.pages.splice(pageIndex, 1);
            for (let lane of state.modelLanes) {
              lane.pages = lane.pages.map((p, o) => ({
                ...p,
                choices: p.choices.map(c => ({
                  ...c,
                  destinationPageId: c.destinationPageId !== pageId ? c.destinationPageId : null,
                })),
                order: o,
              }));
            }
          });
          get().commitModelLanes();
        },
        openPageMoreMenu: pageId => {
          set(state => {
            state.openedMoreMenuPageId = pageId;
          });
        },
        closePageMoreMenu: () => {
          set(state => {
            state.openedMoreMenuPageId = null;
          });
        },
        appendChoice: pageId => {
          const bookId = get().bookId;
          if (!bookId) return;
          const page = get()
            .modelLanes.flatMap(l => l.pages)
            .find(p => p.id === pageId);
          if (!page) return;
          // const newId = idProvider().generateNewFakeId();
          const newId = useFlowChartListStore.getState().getNextId();
          // get().pushAction(() =>
          //   useFlowChartStore
          //     .getState()
          //     .createChoice({
          //       bookId,
          //       pageId: idProvider().getRealId(page.id)!,
          //       content: "선택지를 작성해주세요",
          //     })
          //     .then(choice => idProvider().register("choice", newId, choice.id)),
          // );
          const newChoice: Choice = {
            id: newId,
            sourcePageId: pageId,
            order: page.choices.length,
            destinationPageId: null,
            content: "선택지를 작성해주세요",
          };
          set(state => {
            const page = state.modelLanes.flatMap(l => l.pages).find(p => p.id === pageId);
            page?.choices.push(newChoice);
          });
          get().commitModelLanes();
        },
        updateChoiceContent: (choiceId, content) => {
          const bookId = get().bookId;
          if (!bookId) return;
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              for (let choice of page.choices) {
                if (choiceId === choice.id) {
                  choice.content = content ?? "";
                }
              }
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
          const realPageId = get().viewStates.choices[choiceId].data.sourcePageId!;
          const realChoiceId = choiceId!;
          // get().pushAction(() =>
          //   useFlowChartStore.getState().updateChoiceContent({
          //     bookId,
          //     pageId: realPageId,
          //     choiceId: realChoiceId,
          //     content: content ?? "",
          //   }),
          // );
        },
        loadNewChoice: (realPageId, realChoiceId, content) => {
          // const newChoiceId = idProvider().generateNewFakeId();
          const newChoiceId = useFlowChartListStore.getState().getNextId();
          // idProvider().register("choice", newChoiceId, realChoiceId);
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              if (realPageId === page.id) {
                page.choices.push({
                  id: newChoiceId,
                  order: page.choices.length,
                  content,
                  sourcePageId: page.id,
                  destinationPageId: null,
                });
              }
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
        },
        loadChoiceOrder: (realChoiceId, order) => {
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              const choice = page.choices.find(choice => realChoiceId === choice.id);
              if (!choice) continue;
              page.choices.splice(
                page.choices.findIndex(c => c.id === choice.id),
                1,
              );
              page.choices.splice(order, 0, choice);
              page.choices = page.choices.map((c, i) => ({...c, order: i}));
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
        },
        loadChoiceContent: (realChoiceId, content) => {
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              for (let choice of page.choices) {
                if (realChoiceId === choice.id) {
                  choice.content = content;
                }
              }
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
        },
        loadChoiceDestination: (realChoiceId, destinationPageId) => {
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              for (let choice of page.choices) {
                if (realChoiceId === choice.id) {
                  choice.destinationPageId = destinationPageId ? destinationPageId ?? null : null;
                }
              }
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
        },
        unloadChoice: realChoiceId => {
          const lanes = deepCopyLanes(get().modelLanes);
          for (let lane of lanes) {
            for (let page of lane.pages) {
              const index = page.choices.findIndex(choice => realChoiceId === choice.id);
              if (index === -1) continue;
              page.choices.splice(index, 1);
            }
          }
          get().setModelLanes(lanes);
          get().commitModelLanes();
        },
        moveChoice: (choiceId, choiceOrder) => {
          const bookId = get().bookId;
          if (!bookId) return;
          const pageId = get().viewStates.choices[choiceId].data.sourcePageId;
          // get().pushAction(() =>
          //   useFlowChartStore.getState().updateChoiceOrder({
          //     bookId,
          //     pageId: idProvider().getRealId(pageId)!,
          //     choiceId: idProvider().getRealId(choiceId)!,
          //     order: choiceOrder,
          //   }),
          // );
          set(state => {
            const lanes = deepCopyLanes(state.modelLanes);
            const page = lanes.flatMap(l => l.pages).find(p => p.id === pageId)!;
            const oldOrder = page.choices.findIndex(c => c.id === choiceId);
            const choice = page.choices.splice(oldOrder, 1)[0];
            page.choices.splice(choiceOrder, 0, {
              ...choice,
              sourcePageId: page.id,
            });
            page.choices = page.choices.map((c, o) => ({...c, order: o}));
            state.modelLanes = lanes;
          });
          get().commitModelLanes();
        },
        setChoiceDestination: (choiceId, destinationPageId) => {
          const bookId = get().bookId;
          if (!bookId) return;
          const pageId = get().viewStates.choices[choiceId].data.sourcePageId;
          // get().pushAction(() =>
          //   useFlowChartStore.getState().updateChoiceDestinationPageId({
          //     bookId,
          //     pageId: idProvider().getRealId(pageId)!,
          //     choiceId: idProvider().getRealId(choiceId)!,
          //     destinationPageId: idProvider().getRealId(destinationPageId ?? 0) ?? null,
          //   }),
          // );
          set(state => {
            const lanes = deepCopyLanes(state.modelLanes);
            const choice = lanes
              .flatMap(l => l.pages)
              .flatMap(p => p.choices)
              .find(c => c.id === choiceId)!;
            choice.destinationPageId = destinationPageId;
            state.modelLanes = lanes;
          });
          get().commitModelLanes();
        },
        deleteChoice: choiceId => {
          const bookId = get().bookId;
          if (!bookId) return;
          const pageId = get().viewStates.choices[choiceId].data.sourcePageId;
          // get().pushAction(() =>
          //   useFlowChartStore.getState().deleteChoice(
          //     {
          //       bookId,
          //       pageId: idProvider().getRealId(pageId)!,
          //       choiceId: idProvider().getRealId(choiceId)!,
          //     },
          //     async () => {},
          //   ),
          // );
          set(state => {
            const page = state.modelLanes.flatMap(l => l.pages).find(p => p.id === pageId);
            if (!page) return;
            const choiceIndex = page.choices.findIndex(p => p.id === choiceId);
            if (choiceIndex === -1) return;
            page.choices.splice(choiceIndex, 1);
            page.choices = page.choices.map((c, o) => ({...c, order: o}));
          });
          get().commitModelLanes();
        },
        setFrameSize: size => {
          set(state => {
            state.viewPortState.frameSize = size;
          });
          get().invalidateViewStates();
        },
        scrollViewPort: delta => {
          set(state => {
            const frameSize = state.viewPortState.frameSize;
            const contentSize = state.viewPortState.contentSize;
            const offset = state.viewPortState.offset;
            const oldOffset = {...offset};
            offset.x += delta.x;
            if (offset.x > contentSize.width - frameSize.width)
              offset.x = contentSize.width - frameSize.width;
            if (offset.x < 0) offset.x = 0;
            if (contentSize.height < frameSize.height) offset.y = 0;
            else {
              offset.y += delta.y;
              if (offset.y < frameSize.height / 2 - contentSize.height / 2) {
                offset.y = frameSize.height / 2 - contentSize.height / 2;
              }
              if (offset.y > contentSize.height / 2 - frameSize.height / 2) {
                offset.y = contentSize.height / 2 - frameSize.height / 2;
              }
            }
            state.draggingState.current.x += offset.x - oldOffset.x;
            state.draggingState.current.y += offset.y - oldOffset.y;
          });
        },
        // pushAction: (runnable: () => Promise<any>) => {
        //   const action: Action = {
        //     status: "queued",
        //     runnable,
        //   };
        //   set(state => {
        //     state.actionQueue.push(action);
        //   });
        //   get().updateActionQueue();
        // },
        // updateActionQueue: async () => {
        //   if (get().actionQueue.length === 0 || get().actionQueue[0].status === "running") return;
        //   set(state => {
        //     state.actionQueue[0].status = "running";
        //   });
        //   await get().actionQueue[0].runnable();
        //   set(state => {
        //     state.actionQueue.splice(0, 1);
        //   });
        //   get().updateActionQueue();
        // },
        commitModelLanes: () => {
          useFlowChartListStore.getState().updateFlowChartLanes(get().bookId!, get().modelLanes);
        },
      };
    }),
  ),
);

export default useFlowChartEditorStore;
