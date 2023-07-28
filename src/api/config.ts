import {useAuthStore, useFlowChartStore} from "@/stores";
import {TextersErrorCode} from "@/types/error";
import axios, {AxiosError} from "axios";

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
    const {flowChartLockKey} = useFlowChartStore.getState();
    if (accessToken) {
      request.headers.Authorization = accessToken;
    }
    if (flowChartLockKey) {
      request.headers["flow-chart-lock-key"] = flowChartLockKey;
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
  response => {
    if (response.config.url?.endsWith("flow-chart")) {
      const flowChartLockKey = response.headers["flow-chart-lock-key"];
      const {saveFlowChartLockKey} = useFlowChartStore.getState();
      saveFlowChartLockKey(flowChartLockKey);
    }

    return response.data;
  },
  async error => {
    const originalRequest = error.config;
    const {saveToken, removeToken} = useAuthStore.getState();

    if (error.response.data.code === TextersErrorCode.LOCKED_FLOW_CHART) {
      if (
        confirm(
          "잠깐, 여러 창을 띄워 두고 작업 중이신가요? 텍스터즈는 작품 동시 수정을 지원하고 있지 않아요. 새로고침하시겠어요? 취소하면 홈 화면으로 이동할게요.",
        )
      )
        window.location.reload();
      window.location.href = "/";
    }

    if (error.response.data.code === TextersErrorCode.INVALID_REFRESH_TOKEN) {
      alert(error.response.data.message);
      removeToken();
      window.location.href = "/sign-in";
    }

    if (
      error.response.data.code === TextersErrorCode.INVALID_AUTH_TOKEN &&
      !originalRequest._retry
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
