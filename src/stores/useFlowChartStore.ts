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
import useFlowChartListStore from "./useFlowChartListStore";

type BufferedAction = {key: string; runnable: (() => Promise<void>) | null};
type FlowChartStoreState = {
  // flowChartLockKey: string | null;
  // isSaving: boolean;
  // isLoading: boolean;
  // updatedAt: string;
  flowChart: FlowChart | null;
  // error: TextersError | null;
  // bufferedAction: BufferedAction | null;
};

type FlowChartStoreAction = {
  // updateFlowChartLockKey: (key: string) => void;
  loadFlowChart: (bookId: number) => Promise<void>;
  // createLane: (form: CreateLaneForm) => Promise<Lane>;
  // deleteLane: (form: DeleteLaneForm) => Promise<void>;
  // createPage: (form: CreatePageForm) => Promise<Page>;
  // updatePageInfo: (form: UpdatePageForm) => Promise<void>;
  // updatePageOrder: (form: UpdatePageOrderForm) => Promise<void>;
  // deletePage: (form: DeletePageForm) => Promise<void>;
  // createChoice: (form: CreateChoiceForm) => Promise<Choice>;
  // updateChoiceContent: (form: UpdateChoiceForm) => Promise<void>;
  // updateChoiceOrder: (form: UpdateChoiceOrderForm) => Promise<void>;
  // updateChoiceDestinationPageId: (form: UpdateChoiceDestinationForm) => Promise<void>;
  // deleteChoice: (form: DeleteChoiceForm, onSuccess: () => Promise<void>) => Promise<void>;
  // updateBufferedAction: (key: string, runnable: (() => Promise<void>) | null) => void;
  // commitBufferedAction: () => Promise<void>;
};

const useFlowChartStore = create<FlowChartStoreState & FlowChartStoreAction>()((set, get) => ({
  // flowChartLockKey: null,
  // isSaving: false,
  // isLoading: false,
  // ,
  flowChart: null,
  // error: null,
  // bufferedAction: null,
  // updateFlowChartLockKey: key => set({flowChartLockKey: key}),
  loadFlowChart: async bookId => {
    // if (get().isLoading) return;

    // set({isLoading: true});
    // try {
    const flowChart = useFlowChartListStore.getState().getFlowChart(bookId);
    set({flowChart});
    useFlowChartEditorStore.getState().loadFlowChart(flowChart);
    // } catch (error) {
    // set({isLoading: false, error: (error as AxiosError<TextersError>).response?.data});
    // }
  },
  // createLane: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   // try {
  //   const flowChart = useFlowChartListStore().getFlowChart(form.bookId);
  //   // useFlowChartListStore().updateFlowChart({...lane})
  //   const lane: Lane = {
  //     id: useFlowChartListStore().getNextId(),
  //     ...form,
  //     pages: [],
  //   };
  //   useFlowChartListStore().
  //   return new Promise(() => lane);
  //   // } catch (error) {
  //   // set({error: (error as AxiosError<TextersError>).response?.data});
  //   // }
  // },
  // deleteLane: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     await api.lanes.deleteLane(form);
  //     set({});
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // createPage: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     const page = await api.pages.createPage(form);
  //     set({});
  //     return page;
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // updatePageInfo: async form => {
  //   if (form.content === "") form.content = null;
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     const page = await api.pages.updatePageInfo(form);
  //     // set({updatedAt: page.updatedAt});
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // updatePageOrder: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     const page = await api.pages.updatePageOrder(form);
  //     // set({updatedAt: page.updatedAt});
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // deletePage: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     await api.pages.deletePage(form);
  //     set({});
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // createChoice: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     const choice = await api.choices.createChoice(form);
  //     set({});
  //     return choice;
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // updateChoiceContent: async form => {
  //   if (!form.content) return;

  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     await api.choices.updateChoice(form);
  //     set({});
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // updateChoiceOrder: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     await api.choices.updateChoiceOrder(form);
  //     set({});
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // updateChoiceDestinationPageId: async form => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     await api.choices.updateChoiceDestination(form);
  //     set({});
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // deleteChoice: async (form, onSuccess) => {
  //   // set({isSaving: true});
  //   // await get().commitBufferedAction();
  //   try {
  //     await api.choices.deleteChoice(form);
  //     set({});
  //     onSuccess();
  //   } catch (error) {
  //     // set({error: (error as AxiosError<TextersError>).response?.data});
  //   }
  // },
  // updateBufferedAction: (key, runnable) => {
  //   const action = {key, runnable};
  //   const prevAction = get().bufferedAction;
  //   if (prevAction?.runnable && prevAction.key !== action.key) {
  //     set({bufferedAction: null});
  //     prevAction.runnable();
  //   }
  //   set({bufferedAction: action});
  // },
  // commitBufferedAction: async () => {
  //   const action = get().bufferedAction;
  //   if (!action?.runnable) return;
  //   set({bufferedAction: null});
  //   await action.runnable();
  // },
}));

export default useFlowChartStore;
