import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";
import { axiosInstance } from "@/services/axiosConfig";
import Api from "@/services/service";

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
        const originalRequest = error.config;

        // 1. Ellenőrizzük, hogy 401-es hiba-e
        // 2. Ellenőrizzük, hogy ez NEM egy újrapróbálkozás-e (kerüljük a végtelen ciklust)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Megjelöljük, hogy ez már újrapróbálkozás lesz

          try {
            // 3. Megpróbáljuk frissíteni a tokent
            console.log("Access token lejárt, próbálkozás frissítéssel...");
            const refreshResponse = await Api.refreshToken();
            const { accessToken, user } = refreshResponse!;

            // 4. Frissítjük a globális állapotot és az Axios headert
            setAuthData(accessToken, user);

            // 5. Frissítjük az EREDETI kérés fejlécét az új tokennel
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            console.log(
              "Token frissítve, újrapróbálkozás az eredeti kéréssel."
            );
            // 6. Újrapróbáljuk az eredeti kérést
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // Ha a /refresh is 401-et ad, lejárt a refresh token is
            // Kijelentkeztetjük a usert
            if (
              axios.isAxiosError(refreshError) &&
              refreshError.response?.status === 401
            ) {
              logout(); // Ez törli az állapotot és a cookie-t (a szerverrel)
            }
            return Promise.reject(refreshError);
          }
        }

        // Bármilyen más hiba esetén csak továbbítjuk azt
        return Promise.reject(error);
      }
    );

    // Cleanup funkció: eltávolítjuk az interceptort, ha a komponens unmount-ol
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [setAuthData, logout]);
};
