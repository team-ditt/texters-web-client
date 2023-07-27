import {api} from "@/api";
import {FlowChart, UpdateChoiceForm, UpdatePageForm} from "@/types/book";
import {TextersError} from "@/types/error";
import {AxiosError} from "axios";
import {create} from "zustand";

type FlowChartStoreState = {
  isSaving: boolean;
  updatedAt: string;
  flowChartLockKey: string | null;
  flowChart: FlowChart | null;
  error: TextersError | null;
};

type FlowChartStoreAction = {
  loadFlowChart: (bookId: number) => Promise<void>;
  saveFlowChartLockKey: (key: string) => void;
  updatePageInfo: (form: UpdatePageForm) => Promise<void>;
  createChoice: (form: UpdateChoiceForm) => Promise<void>;
  resetError: () => void;
};

const useAuthStore = create<FlowChartStoreState & FlowChartStoreAction>()(set => ({
  isSaving: false,
  updatedAt: new Date().toISOString(),
  flowChartLockKey: null,
  flowChart: null,
  error: null,
  loadFlowChart: async bookId => {
    const flowChart = await api.books.fetchFlowChart(bookId);
    set({flowChart});
  },
  saveFlowChartLockKey: key => set({flowChartLockKey: key}),
  updatePageInfo: async form => {
    if (form.content === "") form.content = null;
    set({isSaving: true});
    try {
      const page = await api.pages.updatePageInfo(form);
      set({isSaving: false, updatedAt: page.updatedAt});
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  createChoice: async form => {
    set({isSaving: true});
    try {
      await api.choices.createChoice(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  resetError: () => set({error: null}),
}));

export default useAuthStore;
