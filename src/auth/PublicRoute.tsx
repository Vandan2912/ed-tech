import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
