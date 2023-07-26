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
    if (
      response.config.url?.includes("auth/sign-in") ||
      response.config.url?.includes("auth/sign-up")
    ) {
      const accessToken = response.data;
      const {saveToken} = useAuthStore.getState();
      saveToken(`Bearer ${accessToken}`);
    }

    return response.data;
  },
  error => Promise.reject(error),
);

export const axiosAuthenticated = axios.create({...DEFAULT_OPTIONS, withCredentials: true});

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
  response => {
    if (response.config.url?.includes("auth/token-refresh")) {
      const accessToken = response.data;
      const {saveToken} = useAuthStore.getState();
      saveToken(`Bearer ${accessToken}`);
    }

    return response.data;
  },
  error => {
    const {expireSession} = useAuthStore.getState();

    if (error.config.url.includes("auth/token-refresh")) {
      expireSession();
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      return axiosAuthenticated
        .request({
          url: "/auth/token-refresh",
        })
        .then(response => {
          if (!!response) return axiosAuthenticated.request(error.config);
        });
    }

    return Promise.reject(error);
  },
);
