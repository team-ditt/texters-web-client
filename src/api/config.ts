import {useAuthStore} from "@/stores";
import axios from "axios";

const SECONDS_IN_MILLISECONDS = 1000;
const DEFAULT_OPTIONS = {
  baseURL: "/api/v1",
  timeout: 10 * SECONDS_IN_MILLISECONDS,
};

export const axiosPublic = axios.create(DEFAULT_OPTIONS);

axiosPublic.interceptors.response.use(
  response => {
    if (response.data.responseType === "signIn") {
      const {tokens} = response.data;
      const {saveTokens} = useAuthStore.getState();
      saveTokens(`Bearer ${tokens.accessToken}`, tokens.refreshToken);
    }

    return response.data;
  },
  error => Promise.reject(error),
);

export const axiosAuthenticated = axios.create(DEFAULT_OPTIONS);

axiosAuthenticated.interceptors.request.use(
  request => {
    const {accessToken} = useAuthStore.getState();
    if (accessToken) {
      request.headers.Authorization = accessToken;
    }
    return request;
  },
  error => Promise.reject(error),
);

axiosAuthenticated.interceptors.response.use(
  response => response.data,
  async error => {
    const {reissueTokens, removeTokens} = useAuthStore.getState();

    if (error.config.url.includes("auth/token-refresh")) return removeTokens();

    if (error.response.state === 401) {
      return reissueTokens().then(() => axiosAuthenticated.request(error.config));
    }

    return Promise.reject(error);
  },
);
