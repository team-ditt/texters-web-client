import {useAuthStore, useFlowChartStore} from "@/stores";
import {TextersErrorCode} from "@/types/error";
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
  async error => {
    const {expireSession} = useAuthStore.getState();

    if (error.config.url?.includes("auth/token-refresh")) {
      expireSession();
      return Promise.reject(error);
    }

    if (error.response.data.code === TextersErrorCode.INVALID_AUTH_TOKEN) {
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

export const axiosFlowChart = axios.create({...DEFAULT_OPTIONS, withCredentials: true});

axiosFlowChart.interceptors.request.use(
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

axiosFlowChart.interceptors.response.use(
  response => {
    if (response.config.url?.endsWith("flow-chart")) {
      const flowChartLockKey = response.headers["flow-chart-lock-key"];
      const {saveFlowChartLockKey} = useFlowChartStore.getState();
      saveFlowChartLockKey(flowChartLockKey);
    }

    return response.data;
  },
  async error => {
    if (error.response.data.code === TextersErrorCode.INVALID_AUTH_TOKEN) {
      return axiosAuthenticated
        .request({
          url: "/auth/token-refresh",
        })
        .then(response => {
          if (!!response) return axiosFlowChart.request(error.config);
        });
    }

    return Promise.reject(error);
  },
);
