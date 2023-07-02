import axios, {AxiosInstance, AxiosResponse} from "axios";

const SECONDS_IN_MILLISECONDS = 1000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10 * SECONDS_IN_MILLISECONDS,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
