import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000
});

// Global error handler
axios.interceptors.response.use(
  res => res,
  err => {
    if (
      err.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      console.warn("Unauthorized – session expired");
    }
    return Promise.reject(err);
  }
);


export default axiosInstance;
