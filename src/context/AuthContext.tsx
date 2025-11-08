import type { User } from "@/models/user.type";
import { createContext } from "react";

// A Context típusa
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  setAuthData: (accessToken: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;
