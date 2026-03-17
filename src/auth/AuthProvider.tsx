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
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => null);
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}
