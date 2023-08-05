import {create} from "zustand";

type PageLimitAlertModalState = {
  isOpen: boolean;
};
type PageLimitAlertModalAction = {
  openModal: () => void;
  closeModal: () => void;
};

const usePageLimitAlertModalStore = create<PageLimitAlertModalState & PageLimitAlertModalAction>()(
  set => ({
    isOpen: false,
    openModal: () => {
      set({isOpen: true});
    },
    closeModal: () => {
      set({isOpen: false});
    },
  }),
);

export default usePageLimitAlertModalStore;
