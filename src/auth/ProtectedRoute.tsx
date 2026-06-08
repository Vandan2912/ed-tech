import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "./useAuth";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileBottomBar } from "@/components/MobileBottomBar";

export default function ProtectedRoute({
  children,
  header = true,
  footer = true,
  // allowUnboarded = false,
}: {
  children: JSX.Element;
  header?: boolean;
  footer?: boolean;
  allowUnboarded?: boolean;
}) {
  const {
    token,
    // user
  } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If onboarding is pending and this route doesn't allow un-onboarded users,
  // redirect to /onboarding
  // if (!allowUnboarded && user && !user.is_onboarded) {
  //   return <Navigate to="/onboarding" replace />;
  // }

  return (
    <>
      {header && <Header />}
      <div className={header ? "pb-10 md:pb-0" : undefined}>{children}</div>
      {footer && <Footer />}
      {header && <MobileBottomBar />}
    </>
  );
}
