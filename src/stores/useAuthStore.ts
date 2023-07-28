import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type AuthStoreState = {
  accessToken: string | null;
  isSessionExpired: boolean;
};

type AuthStoreAction = {
  didSignIn: () => boolean;
  saveToken: (accessToken: string) => void;
  removeToken: () => void;
  expireSession: () => void;
  resolveExpiredSession: () => void;
};

const useAuthStore = create<AuthStoreState & AuthStoreAction>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isSessionExpired: false,
      didSignIn: () => {
        const {accessToken, isSessionExpired} = get();
        return Boolean(accessToken && !isSessionExpired);
      },
      saveToken: accessToken => set({accessToken}),
      removeToken: () => set({accessToken: null}),
      expireSession: () => set({isSessionExpired: true}),
      resolveExpiredSession: () => set({isSessionExpired: false}),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
