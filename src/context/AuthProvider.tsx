import type { User } from "@/models/user.type";
import { setAuthToken } from "@/services/axiosConfig";
import Api from "@/services/service";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, type ReactNode } from "react";
import AuthContext from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // App betöltés jelző

  // Ez a "Silent Auth" az app betöltésekor
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Megpróbáljuk frissíteni a tokent a HttpOnly cookie alapján
        const response = await Api.refreshToken();

        if (response) {
          console.log("Silent Auth az app betöltésekor sikeres.", response);
          const { accessToken, user } = response;
          setAuthData(accessToken, user);
        }
      } catch (error: unknown) {
        // Ha hibát kap (pl. 401), az azt jelenti, nincs érvényes session
        console.log("Nincs érvényes munkamenet", error);
        setAuthData(null, null); // Kijelentkeztetjük
      } finally {
        setIsLoading(false); // Befejeztük a betöltést
      }
    };

    checkUserSession();
  }, []);

  // Segédfüggvény az állapot és az Axios header beállítására
  const setAuthData = (token: string | null, user: User | null) => {
    setAuthToken(token); // Beállítja az Axios default header-t
    setAccessToken(token);
    setUser(user);
  };

  const refreshMe = async () => {
    const freshUser = await Api.getProfile();
    setUser(freshUser);
  };

  // Bejelentkezés (ezt a Login oldal hívja meg)
  const login = (accessToken: string, user: User) => {
    setAuthData(accessToken, user);
  };

  // Kijelentkezés
  const logout = async () => {
    try {
      // Értesítjük a szervert, hogy törölje a cookie-t
      await Api.logout();
    } catch (error) {
      console.error("Logout hiba", error);
    } finally {
      // A React Query cache-t töröljük, hogy az előző user adatai ne maradjanak
      queryClient.clear();
      // A kliens oldali állapotot mindenképp töröljük
      setAuthData(null, null);
    }
  };

  const value = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    setAuthData,
    refreshMe,
  };

  // Amíg töltünk, ne mutassunk semmit
  if (isLoading) {
    return <div>Alkalmazás betöltése...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
