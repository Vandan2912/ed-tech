import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "./useAuth";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function ProtectedRoute({
  children,
  header = true,
  footer = true,
}: {
  children: JSX.Element;
  header?: boolean;
  footer?: boolean;
}) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {header && <Header />}
      {children}
      {footer && <Footer />}
    </>
  );
}
