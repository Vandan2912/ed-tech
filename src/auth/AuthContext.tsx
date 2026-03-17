import { createContext } from "react";
import type { User } from "./AuthProvider";

export type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
