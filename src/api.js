import axios from "axios";
import {APP_CONSTANTS} from "./util/constant" 

const api = axios.create({
  baseURL: APP_CONSTANTS.BACKEND_URL, // backend
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🚨 Handle auth failure globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("jwt"); // clear invalid token
      window.location.href = "/msr-workbench/login"; // force login
    }
    return Promise.reject(error);
  }
);

export default api;
