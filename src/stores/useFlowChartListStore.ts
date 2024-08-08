import {api} from "@/api";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {
  Choice,
  CreateChoiceForm,
  CreateLaneForm,
  CreatePageForm,
  DeleteChoiceForm,
  DeleteLaneForm,
  DeletePageForm,
  FlowChart,
  Lane,
  Page,
  UpdateChoiceDestinationForm,
  UpdateChoiceForm,
  UpdateChoiceOrderForm,
  UpdatePageForm,
  UpdatePageOrderForm,
} from "@/types/book";
import {TextersError} from "@/types/error";
import {AxiosError} from "axios";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

// type BufferedAction = {key: string; runnable: (() => Promise<void>) | null};
type FlowChartListStoreState = {
  flowCharts: {[key: string]: FlowChart};
  nextId: number;
};

type FlowChartListStoreAction = {
  getFlowChart: (bookId: number) => FlowChart;
  createFlowChart: (flowChart: FlowChart) => FlowChart;
  updateFlowChart: (flowChart: FlowChart) => FlowChart;
  updateFlowChartLanes: (bookId: number, lanes: Lane[]) => FlowChart;
  removeFlowChart: (bookId: number) => void;
  getNextId: () => number;
};

const useFlowChartListStore = create<FlowChartListStoreState & FlowChartListStoreAction>()(
  persist(
    (set, get) => ({
      flowCharts: {},
      nextId: 1,
      getFlowChart: bookId => {
        return get().flowCharts[bookId];
      },
      createFlowChart: (flowChart: FlowChart) => {
        set({flowCharts: {...get().flowCharts, [flowChart.id]: flowChart}});
        return flowChart;
      },
      updateFlowChart: (flowChart: FlowChart) => {
        set({flowCharts: {...get().flowCharts, [flowChart.id]: flowChart}});
        return flowChart;
      },
      updateFlowChartLanes: (bookId: number, lanes: Lane[]) => {
        const flowChart = {...get().getFlowChart(bookId), lanes};
        set({flowCharts: {...get().flowCharts, [bookId]: flowChart}});
        return flowChart;
      },
      removeFlowChart: (bookId: number) => {
        const _flowCharts = {...get().flowCharts};
        delete _flowCharts[bookId];
        set({flowCharts: _flowCharts});
      },
      getNextId: () => {
        const nextId = get().nextId;
        set({nextId: nextId + 1});
        return nextId;
      },
    }),
    {
      name: "flowchart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useFlowChartListStore;
