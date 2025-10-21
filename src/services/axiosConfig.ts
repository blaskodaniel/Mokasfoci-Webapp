import { APP_CONFIG } from "@/config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: APP_CONFIG.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
