import { useEffect } from "react";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuth } from "./useAuth";
import { axiosInstance } from "@/services/axiosConfig";
import Api from "@/services/service";
import type { User } from "@/models/user.type";

type RefreshTokenResponse = { accessToken: string; user: User };

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<RefreshTokenResponse | null> | null = null;

/**
 * Ez egy "Hook", amit a fő App komponensben hívunk meg.
 * A feladata, hogy beállítsa az Axios interceptort.
 * Mivel hook, hozzáfér az AuthContext-hez (setAuthData).
 */
export const useAxiosInterceptor = () => {
  const { setAuthData, logout } = useAuth();

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response, // Ha 2xx válasz jön, csak engedjük tovább
      async (error) => {
        // az eredeti Axios kérés konfigurációját elmentjük (error.config)
        const originalRequest = error.config as RetriableRequestConfig;

        // 1. Ellenőrizzük, hogy 401-es hiba-e
        // 2. Ellenőrizzük, hogy ez NEM egy újrapróbálkozás-e (kerüljük a végtelen ciklust)
        console.log("Axios interceptor elkapta a hibát:", error.response?.status);
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("refresh")
        ) {
          originalRequest._retry = true; // Megjelöljük, hogy ez már újrapróbálkozás lesz

          try {
            // 3. Megpróbáljuk frissíteni a tokent, de csak egyszer ha több request van egyszerre
            if (!refreshPromise) {
              refreshPromise = Api.refreshToken().finally(() => {
                refreshPromise = null;
              });
            }

            const refreshResponse = await refreshPromise;
            if (!refreshResponse) {
              await logout();
              return Promise.reject(error);
            }

            const { accessToken, user } = refreshResponse;

            // 4. Frissítjük a globális állapotot és az Axios headert
            setAuthData(accessToken, user);

            // 5. Frissítjük az EREDETI kérés fejlécét az új tokennel
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            console.log("Token frissítve, újrapróbálkozás az eredeti kéréssel.");
            // 6. Újrapróbáljuk az eredeti kérést
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // Ha a /refresh is 401-et ad, lejárt a refresh token is
            // Kijelentkeztetjük a usert
            if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
              logout(); // Ez törli az állapotot és a cookie-t (a szerverrel)
            }
            // Az eredeti hibát továbbítjuk
            return Promise.reject(error);
          }
        }

        // Bármilyen más hiba esetén csak továbbítjuk azt, de a data.message-t mindig átadjuk
        const customError = {
          ...error,
          message: error?.response?.data?.message || error.message,
          response: error?.response,
        };
        return Promise.reject(customError);
      }
    );

    // Cleanup funkció: eltávolítjuk az interceptort, ha a komponens unmount-ol
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [setAuthData, logout]);
};
