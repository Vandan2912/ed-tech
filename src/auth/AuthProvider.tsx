import { useState } from "react";
import { AuthContext } from "./AuthContext";

export type User = {
  email: string;
  first_name: string;
  id: string;
  is_onboarded: boolean;
  last_login: string;
  last_name: string;
  mobile_number: string;
  profile_picture: string;
  role: string;
  isOnboarded: boolean;
  school_name: string;
  district: string;
  state: string;
  country: string;
  contact_number: string;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [user, setUserState] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const login = (token: string, userData: User) => {
    setToken(token);
    localStorage.setItem("token", token);
    setUserState(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUserState(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{ token, user, login, logout, setUser }}>{children}</AuthContext.Provider>;
}
