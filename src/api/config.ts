import {useAuthStore} from "@/stores";
import {TextersErrorCode} from "@/types/error";
import axios, {AxiosError} from "axios";

const SECONDS_IN_MILLISECONDS = 1000;
const DEFAULT_OPTIONS = {
  baseURL: import.meta.env.MODE === "production" ? import.meta.env.VITE_API_URL : "/api/v1",
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

let isRefreshing = false;
let failedQueue: {resolve: (token: string) => void; reject: (error: AxiosError) => void}[] = [];

function resolveQueue(token: string) {
  failedQueue.forEach(promise => promise.resolve(token));
  failedQueue = [];
}

function rejectQueue(error: AxiosError) {
  failedQueue.forEach(promise => promise.reject(error));
  failedQueue = [];
}

axiosAuthenticated.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config;
    const {isSessionExpired, saveToken, expireSession} = useAuthStore.getState();

    if (error.response.data.code === TextersErrorCode.INVALID_REFRESH_TOKEN) {
      expireSession();
      return Promise.resolve(error);
    }

    if (
      error.response.data.code === TextersErrorCode.INVALID_AUTH_TOKEN &&
      !originalRequest._retry &&
      !isSessionExpired
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            originalRequest.headers.Authorization = token;
            return axiosAuthenticated(originalRequest);
          })
          .catch(error => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axiosAuthenticated
          .get("/auth/token-refresh")
          .then(response => {
            const accessToken = `Bearer ${response}`;
            originalRequest.headers.Authorization = accessToken;
            saveToken(accessToken);
            resolveQueue(accessToken);
            resolve(axiosAuthenticated(originalRequest));
          })
          .catch(error => {
            rejectQueue(error);
            reject(error);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);
