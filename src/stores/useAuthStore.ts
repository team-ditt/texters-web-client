import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type AuthStoreState = {
  accessToken: string | null;
  isSessionExpired: boolean;
};

type AuthStoreAction = {
  saveToken: (accessToken: string) => void;
  removeToken: () => void;
  expireSession: () => void;
  resolveExpiredSession: () => void;
};

const useAuthStore = create<AuthStoreState & AuthStoreAction>()(
  persist(
    set => ({
      accessToken: null,
      isSessionExpired: false,
      saveToken: accessToken => set({accessToken}),
      removeToken: () => set({accessToken: null}),
      expireSession: () => set({accessToken: null, isSessionExpired: true}),
      resolveExpiredSession: () => set({isSessionExpired: false}),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
