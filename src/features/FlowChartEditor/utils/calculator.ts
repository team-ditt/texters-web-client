import {Lane, Page} from "@/types/book";
import {
  Box,
  Coordinate,
  DraggingState,
  ElementState,
  Size,
  Transition,
  ViewStates,
} from "@/types/flowChartEditor";

export const PAGE_WIDTH = 500;
export const PAGE_CONTENT_HORIZONTAL_MARGIN = 72;
export const PAGE_CONTENT_VERTICAL_MARGIN = 56;
export const PAGE_CONTENT_HORIZONTAL_PADDING = 16;
export const PAGE_BASE_HEIGHT = 234;
export const PAGE_POINT_OFFSET_X = 16;
export const PAGE_POINT_OFFSET_Y = 16;
export const CHOICE_Y_OFFSET = 68;
export const CHOICE_HEIGHT = 53;
export const NEW_LANE_BUTTON_SIZE = 24;
export const NEW_PAGE_BUTTON_HEIGHT = 32;
export const NEW_PAGE_BUTTON_MARGIN = -4;

export const calcCurrentState = (
  transition: Transition,
  time: number,
): {progress: number; current: ElementState} => {
  const elapsed = time - transition.startTimestamp;
  let progress = elapsed / transition.duration;
  if (progress <= 0) return {progress: 0, current: transition.src};
  if (progress >= 1) return {progress: 1, current: transition.dst};
  const srcBox = transition.src.box;
  const dstBox = transition.dst.box;
  progress = -Math.cos(progress * Math.PI) / 2 + 0.5;
  return {
    progress,
    current: {
      opacity: progress * transition.dst.opacity + (1 - progress) * transition.src.opacity,
      scale: progress * transition.dst.scale + (1 - progress) * transition.src.scale,
      box: {
        x: progress * dstBox.x + (1 - progress) * srcBox.x,
        y: progress * dstBox.y + (1 - progress) * srcBox.y,
        width: progress * dstBox.width + (1 - progress) * srcBox.width,
        height: progress * dstBox.height + (1 - progress) * srcBox.height,
      },
    },
  };
};

const calcPageSize = (page: Page): Size => {
  return {
    width: PAGE_WIDTH,
    height:
      PAGE_BASE_HEIGHT + page.choices.length * CHOICE_HEIGHT - (page.choices.length === 5 ? 52 : 0),
  };
};

export const calcChoiceBox = (pageBox: Box, choiceOrder: number): Box => ({
  x: pageBox.x + PAGE_CONTENT_HORIZONTAL_MARGIN + 32,
  y: pageBox.y + PAGE_CONTENT_VERTICAL_MARGIN + CHOICE_Y_OFFSET + choiceOrder * CHOICE_HEIGHT,
  width: PAGE_WIDTH - PAGE_CONTENT_HORIZONTAL_MARGIN * 2 - 48,
  height: CHOICE_HEIGHT,
});

export const calcChoicePointOffset = (): Coordinate => ({
  x: PAGE_WIDTH - PAGE_CONTENT_HORIZONTAL_MARGIN * 2 - 32 - 36,
  y: CHOICE_HEIGHT - 32,
});

export const calcPagePointOffset = (): Coordinate => ({
  x: PAGE_CONTENT_HORIZONTAL_MARGIN + PAGE_POINT_OFFSET_X + 29,
  y: PAGE_CONTENT_VERTICAL_MARGIN + PAGE_POINT_OFFSET_Y + 12,
});

export const calcElementBoxesModel = (lanes: Lane[]): {pages: {[key: number]: Box}} => {
  const pageBoxes: {[key: number]: Box} = {};

  for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
    const lane = lanes[laneOrder];
    let laneHeight = 0;
    for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
      const page = lane.pages[pageOrder];
      const size = calcPageSize(page);
      pageBoxes[page.id] = {
        x: lane.order * PAGE_WIDTH,
        y: laneHeight,
        ...size,
      };
      laneHeight += size.height;
    }
    for (let page of lane.pages) {
      pageBoxes[page.id].y -= laneHeight / 2;
    }
  }

  return {
    pages: pageBoxes,
  };
};

export const calcStaticElementBoxes = (
  viewStates: ViewStates,
  frameSize: Size,
): {
  lanes: {[key: number]: Box};
  newLaneButton: Box | undefined;
} => {
  const laneBoxes: {[key: number]: Box} = {};
  let newLaneButtonBox: Box | null = null;

  const lanes: Lane[] = [];
  for (let laneId in viewStates.lanes) {
    const lane = viewStates.lanes[laneId].data;
    if (viewStates.lanes[laneId].toPresent) lanes.push(lane);
  }
  lanes.sort((a, b) => a.order - b.order);

  for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
    const lane = lanes[laneOrder];
    const laneBox = {
      x: laneOrder * PAGE_WIDTH,
      y: 0,
      width: PAGE_WIDTH,
      height: frameSize.height,
    };
    laneBoxes[lane.id] = laneBox;

    if (
      viewStates.newLaneButton.toPresent &&
      viewStates.newLaneButton.data.laneOrder === laneOrder
    ) {
      newLaneButtonBox = {
        x: laneBox.x + laneBox.width - NEW_LANE_BUTTON_SIZE / 2,
        y: laneBox.y + frameSize.height / 2 - NEW_LANE_BUTTON_SIZE / 2,
        width: NEW_LANE_BUTTON_SIZE,
        height: NEW_LANE_BUTTON_SIZE,
      };
    }
  }

  return {
    lanes: laneBoxes,
    newLaneButton: newLaneButtonBox ?? undefined,
  };
};

export const calcDynamicElementBoxes = (
  viewStates: ViewStates,
  frameSize: Size,
): {
  pages: {[key: number]: Box};
  choices: {[key: number]: Box};
  newPageButton: Box | undefined;
  newLanePageButton: Box | undefined;
  contentSize: Size;
} => {
  const pageBoxes: {[key: number]: Box} = {};
  const choiceBoxes: {[key: number]: Box} = {};
  let newPageButtonBox: Box | null = null;
  let newLanePageButtonBox: Box | null = null;
  const contentSize = {
    width: PAGE_WIDTH,
    height: 0,
  };

  const lanes: Lane[] = [];
  for (let laneId in viewStates.lanes) {
    const lane = viewStates.lanes[laneId].data;
    if (viewStates.lanes[laneId].toPresent) lanes.push(lane);
  }
  lanes.sort((a, b) => a.order - b.order);

  for (let laneOrder = 0; laneOrder < lanes.length; ++laneOrder) {
    const lane = lanes[laneOrder];
    const laneX = lane.order * PAGE_WIDTH;
    let laneHeight = 0;
    for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
      const page = lane.pages[pageOrder];

      if (
        viewStates.newPageButton.toPresent &&
        viewStates.newPageButton.data.laneOrder === laneOrder &&
        viewStates.newPageButton.data.pageOrder === pageOrder
      ) {
        newPageButtonBox = {
          x: laneX,
          y: laneHeight - 24,
          width: PAGE_WIDTH,
          height: NEW_PAGE_BUTTON_HEIGHT,
        };
        laneHeight += newPageButtonBox.height;
      }

      const size = calcPageSize(page);
      const pageBox = {
        x: laneX,
        y: laneHeight,
        ...size,
      };
      pageBoxes[page.id] = pageBox;
      laneHeight += size.height;

      for (let choiceOrder = 0; choiceOrder < page.choices.length; ++choiceOrder) {
        const choice = page.choices[choiceOrder];
        choiceBoxes[choice.id] = calcChoiceBox(pageBox, choiceOrder);
      }
    }

    if (
      viewStates.newPageButton.toPresent &&
      viewStates.newPageButton.data.laneOrder === laneOrder &&
      viewStates.newPageButton.data.pageOrder === lane.pages.length
    ) {
      newPageButtonBox = {
        x: laneX,
        y: laneHeight,
        width: PAGE_WIDTH,
        height: NEW_PAGE_BUTTON_HEIGHT,
      };
      laneHeight += newPageButtonBox.height;
    }

    const offset = -laneHeight / 2;

    if (
      lane.pages.length === 0 &&
      viewStates.newLanePageButton.toPresent &&
      viewStates.newLanePageButton.data.laneOrder === laneOrder
    ) {
      newLanePageButtonBox = {
        x: laneX,
        y: frameSize.height / 2 - NEW_PAGE_BUTTON_HEIGHT / 2,
        width: PAGE_WIDTH,
        height: NEW_PAGE_BUTTON_HEIGHT,
      };
    }

    for (let pageOrder = 0; pageOrder < lane.pages.length; ++pageOrder) {
      const page = lane.pages[pageOrder];
      pageBoxes[page.id].y += offset;
      for (let choiceOrder = 0; choiceOrder < page.choices.length; ++choiceOrder) {
        const choice = page.choices[choiceOrder];
        choiceBoxes[choice.id].y += offset;
      }
    }

    if (viewStates.newPageButton.data.laneOrder === laneOrder && newPageButtonBox) {
      newPageButtonBox.y += offset;
    }

    if (
      laneOrder === lanes.length - 1 &&
      viewStates.newLanePageButton.toPresent &&
      viewStates.newLanePageButton.data.laneOrder === lanes.length
    ) {
      newLanePageButtonBox = {
        x: laneX + PAGE_WIDTH,
        y: frameSize.height / 2 - NEW_PAGE_BUTTON_HEIGHT / 2,
        width: PAGE_WIDTH,
        height: NEW_PAGE_BUTTON_HEIGHT,
      };
    }

    contentSize.width += PAGE_WIDTH;
    contentSize.height = Math.max(contentSize.height, laneHeight);
  }
  contentSize.height += frameSize.height;

  return {
    pages: pageBoxes,
    choices: choiceBoxes,
    newPageButton: newPageButtonBox ?? undefined,
    newLanePageButton: newLanePageButtonBox ?? undefined,
    contentSize,
  };
};

export const isSameBox = (s1: Box, s2: Box) => {
  return s1.x === s2.x && s1.y === s2.y && s1.width === s2.width && s1.height === s2.height;
};

export const isSameElementState = (s1: ElementState, s2: ElementState) => {
  return s1.opacity === s2.opacity && s1.scale === s2.scale && isSameBox(s1.box, s2.box);
};

export const findOrder = (state: Lane[], pageId: number) => {
  for (let laneIndex = 0; laneIndex < state.length; ++laneIndex) {
    const lane = state[laneIndex];
    for (let pageIndex = 0; pageIndex < lane.pages.length; ++pageIndex) {
      if (lane.pages[pageIndex].id == pageId) return [laneIndex, pageIndex];
    }
  }
  return [-1, -1];
};

export const adjustPagePositionByDragging = (
  draggingState: DraggingState,
  pageBox: Box,
): Coordinate => {
  const dragPosition = {
    x: draggingState.current.x - draggingState.offset.x,
    y: draggingState.current.y - draggingState.offset.y,
  };
  return {
    x: pageBox.x + (dragPosition.x - pageBox.x) / 3,
    y: pageBox.y + (dragPosition.y - pageBox.y) / 3,
  };
};

export const contains = (box: Box, position: Coordinate): boolean => {
  return (
    box.x <= position.x &&
    position.x <= box.x + box.width &&
    box.y <= position.y &&
    position.y <= box.y + box.height
  );
};
