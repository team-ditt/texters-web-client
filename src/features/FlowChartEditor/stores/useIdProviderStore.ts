import {Choice, Lane, Page} from "@/types/book";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

type EntityType = "lane" | "page" | "choice";

type IdProviderState = {
  nextId: number;
  idMaps: {[key: number]: number};
  revIdMaps: {[key in EntityType]: {[key: number]: number}};
};
type IdProviderAction = {
  convertFlowChart: (lanes: Lane[]) => Lane[];
  generateNewFakeId: () => number;
  getRealId: (id: number) => number | undefined;
  getFakeId: (entityType: EntityType, id: number) => number | undefined;
  register: (fakeId: number, runnable: Promise<Lane | Page | Choice>) => Promise<void>;
};

const useIdProviderStore = create<IdProviderState & IdProviderAction>()(
  immer((set, get) => ({
    nextId: -1,
    idMaps: {},
    revIdMaps: {
      lane: {},
      page: {},
      choice: {},
    },
    convertFlowChart: lanes => {
      set({
        nextId: -1,
        idMaps: {},
        revIdMaps: {
          lane: {},
          page: {},
          choice: {},
        },
      });
      for (let lane of lanes) {
        const laneId = get().generateNewFakeId();
        set(state => {
          state.idMaps[laneId] = lane.id;
          state.revIdMaps["lane"][lane.id] = laneId;
        });
        lane.id = laneId;
        for (let page of lane.pages) {
          const pageId = get().generateNewFakeId();
          set(state => {
            state.idMaps[pageId] = page.id;
            state.revIdMaps["page"][page.id] = pageId;
          });
          page.id = pageId;
          for (let choice of page.choices) {
            const choiceId = get().generateNewFakeId();
            set(state => {
              state.idMaps[choiceId] = choice.id;
              state.revIdMaps["choice"][choice.id] = choiceId;
            });
            choice.id = choiceId;
          }
        }
      }
      const revIdMaps = get().revIdMaps;
      for (let lane of lanes) {
        for (let page of lane.pages) {
          page.laneId = revIdMaps["lane"][page.laneId];
          for (let choice of page.choices) {
            choice.sourcePageId = revIdMaps["page"][choice.sourcePageId];
            if (choice.destinationPageId)
              choice.destinationPageId = revIdMaps["page"][choice.destinationPageId];
          }
        }
      }
      return lanes;
    },
    generateNewFakeId: () => {
      const nextId = get().nextId;
      set(state => {
        --state.nextId;
      });
      return nextId;
    },
    getRealId: id => get().idMaps[id],
    getFakeId: (entityType, id) => get().revIdMaps[entityType][id],
    register: async (fakeId, runnable) => {
      const entity = await runnable;
      set(state => {
        state.idMaps[fakeId] = entity.id;
      });
    },
  })),
);

export default useIdProviderStore;
