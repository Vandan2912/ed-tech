import { useState } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => Cookies.get("token") || null);

  const login = (token: string) => {
    Cookies.set("token", token, { expires: 7 });
    setToken(token);
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}
