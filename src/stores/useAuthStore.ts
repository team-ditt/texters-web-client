import axios from "axios";
import {create} from "zustand";

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthStoreAction = {
  saveTokens: (accessToken: string, refreshToken: string) => void;
  reissueTokens: () => Promise<void>;
  removeTokens: () => void;
};

const useAuthStore = create<AuthStoreState & AuthStoreAction>()((set, get) => ({
  accessToken: null,
  refreshToken: null,
  saveTokens: (accessToken, refreshToken) => set({accessToken, refreshToken}),
  reissueTokens: async () => {
    const {refreshToken, saveTokens, removeTokens} = get();
    try {
      if (!refreshToken) return;
      const {headers} = await axios.get(`/api/v1/auth/token-reissue`, {
        headers: {refreshToken},
      });
      saveTokens(headers.authorization, headers.refreshToken);
    } catch (e) {
      removeTokens();
    }
  },
  removeTokens: () => set({accessToken: null, refreshToken: null}),
}));

export default useAuthStore;
