import {api} from "@/api";
import {
  CreateChoiceForm,
  DeleteChoiceForm,
  FlowChart,
  UpdateChoiceDestinationForm,
  UpdateChoiceForm,
  UpdatePageForm,
} from "@/types/book";
import {TextersError} from "@/types/error";
import {AxiosError} from "axios";
import {create} from "zustand";

type FlowChartStoreState = {
  isSaving: boolean;
  isLoading: boolean;
  updatedAt: string;
  flowChartLockKey: string | null;
  flowChart: FlowChart | null;
  error: TextersError | null;
};

type FlowChartStoreAction = {
  loadFlowChart: (bookId: number) => Promise<void>;
  saveFlowChartLockKey: (key: string) => void;
  updatePageInfo: (form: UpdatePageForm) => Promise<void>;
  createChoice: (form: CreateChoiceForm) => Promise<void>;
  updateChoiceContent: (form: UpdateChoiceForm) => Promise<void>;
  updateChoiceDestinationPageId: (form: UpdateChoiceDestinationForm) => Promise<void>;
  deleteChoice: (form: DeleteChoiceForm, onSuccess: () => Promise<void>) => Promise<void>;
};

const useAuthStore = create<FlowChartStoreState & FlowChartStoreAction>()((set, get) => ({
  isSaving: false,
  isLoading: false,
  updatedAt: new Date().toISOString(),
  flowChartLockKey: null,
  flowChart: null,
  error: null,
  loadFlowChart: async bookId => {
    if (get().isLoading) return;

    set({isLoading: true});
    try {
      const flowChart = await api.books.fetchFlowChart(bookId);
      set({flowChart, isLoading: false});
    } catch (error) {
      set({isLoading: false, error: (error as AxiosError<TextersError>).response?.data});
    }
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
  updateChoiceContent: async form => {
    if (!form.content) return;

    set({isSaving: true});
    try {
      await api.choices.updateChoice(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  updateChoiceDestinationPageId: async form => {
    set({isSaving: true});
    try {
      await api.choices.updateChoiceDestination(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  deleteChoice: async (form, onSuccess) => {
    set({isSaving: true});
    try {
      await api.choices.deleteChoice(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
      onSuccess();
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
}));

export default useAuthStore;
