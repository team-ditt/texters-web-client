import {Choice, Lane, Page} from "@/types/book";

export type Size = {
  width: number;
  height: number;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type Box = Size & Coordinate;

export type DraggingState = {
  isDragging: "page" | "choice" | "path" | null;
  sourceId: number | null;
  offset: Coordinate;
  current: Coordinate;
};

export type HoveringTargetType = "page" | "choice" | "path";
export type HoveringState = {
  isHovering: HoveringTargetType | null;
  sourceId: number | null;
};

export type ElementState = {
  opacity: number;
  scale: number;
  box: Box;
};

export type Transition = {
  src: ElementState;
  dst: ElementState;
  startTimestamp: number;
  duration: number;
};

export type NewPageButtonState = {
  laneOrder: number;
  pageOrder: number;
};

export type NewLanePageButtonState = {
  laneOrder: number;
};

export type NewLaneButtonState = {
  laneOrder: number;
};

export type Visibility = "hidden" | "showing" | "present" | "hiding";

export type ViewState<T> = {
  data: T;
  toPresent: boolean;
  visibility: Visibility;
  elementState: ElementState | null;
  transition: Transition | null;
};

export type ViewPortState = {
  offset: Coordinate;
  scale: number;
  frameSize: Size;
  contentSize: Size;
};

export type ViewStates = {
  lanes: {[key: number]: ViewState<Lane>};
  pages: {[key: number]: ViewState<Page>};
  choices: {[key: number]: ViewState<Choice>};
  newPageButton: ViewState<NewPageButtonState>;
  newLanePageButton: ViewState<NewLanePageButtonState>;
  newLaneButton: ViewState<NewLaneButtonState>;
};

export type Action = {
  status: "queued" | "running";
  runnable: () => Promise<any>;
};
