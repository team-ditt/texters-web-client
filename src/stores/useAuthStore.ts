import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type AuthStoreState = {
  accessToken: string | null;
};

type AuthStoreAction = {
  didSignIn: () => boolean;
  saveToken: (accessToken: string) => void;
  removeToken: () => void;
};

const useAuthStore = create<AuthStoreState & AuthStoreAction>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isSessionExpired: false,
      didSignIn: () => Boolean(get().accessToken),
      saveToken: accessToken => set({accessToken}),
      removeToken: () => set({accessToken: null}),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
