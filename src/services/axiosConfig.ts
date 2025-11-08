import { APP_CONFIG } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: APP_CONFIG.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Segédfüggvény az Access Token beállításához
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
