import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname !== "/login") {
      console.warn("Unauthorized – session expired");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
