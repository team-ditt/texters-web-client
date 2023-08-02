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

type FlowChartStoreState = {
  isSaving: boolean;
  isLoading: boolean;
  updatedAt: string;
  flowChart: FlowChart | null;
  error: TextersError | null;
};

type FlowChartStoreAction = {
  loadFlowChart: (bookId: number) => Promise<void>;
  createLane: (form: CreateLaneForm) => Promise<Lane>;
  deleteLane: (form: DeleteLaneForm) => Promise<void>;
  createPage: (form: CreatePageForm) => Promise<Page>;
  updatePageInfo: (form: UpdatePageForm) => Promise<void>;
  updatePageOrder: (form: UpdatePageOrderForm) => Promise<void>;
  deletePage: (form: DeletePageForm) => Promise<void>;
  createChoice: (form: CreateChoiceForm) => Promise<Choice>;
  updateChoiceContent: (form: UpdateChoiceForm) => Promise<void>;
  updateChoiceOrder: (form: UpdateChoiceOrderForm) => Promise<void>;
  updateChoiceDestinationPageId: (form: UpdateChoiceDestinationForm) => Promise<void>;
  deleteChoice: (form: DeleteChoiceForm, onSuccess: () => Promise<void>) => Promise<void>;
};

const useFlowChartStore = create<FlowChartStoreState & FlowChartStoreAction>()((set, get) => ({
  isSaving: false,
  isLoading: false,
  updatedAt: new Date().toISOString(),
  flowChart: null,
  error: null,
  loadFlowChart: async bookId => {
    if (get().isLoading) return;

    set({isLoading: true});
    try {
      const flowChart = await api.books.fetchFlowChart(bookId);
      set({flowChart, isLoading: false});
      useFlowChartEditorStore.getState().loadFlowChart(flowChart);
    } catch (error) {
      set({isLoading: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  createLane: async form => {
    set({isSaving: true});
    try {
      const lane = await api.lanes.createLane(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
      return lane;
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  deleteLane: async form => {
    set({isSaving: true});
    try {
      await api.lanes.deleteLane(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  createPage: async form => {
    set({isSaving: true});
    try {
      const page = await api.pages.createPage(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
      return page;
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
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
  updatePageOrder: async form => {
    set({isSaving: true});
    try {
      const page = await api.pages.updatePageOrder(form);
      set({isSaving: false, updatedAt: page.updatedAt});
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  deletePage: async form => {
    set({isSaving: true});
    try {
      await api.pages.deletePage(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
    } catch (error) {
      set({isSaving: false, error: (error as AxiosError<TextersError>).response?.data});
    }
  },
  createChoice: async form => {
    set({isSaving: true});
    try {
      const choice = await api.choices.createChoice(form);
      set({isSaving: false, updatedAt: new Date().toISOString()});
      return choice;
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
  updateChoiceOrder: async form => {
    set({isSaving: true});
    try {
      await api.choices.updateChoiceOrder(form);
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

export default useFlowChartStore;
