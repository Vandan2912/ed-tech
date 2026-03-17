import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { Toaster as Sonner } from "./components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Onboarding from "./pages/OnBoarding";
import Home from "./pages/Home";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/onboarding"
                element={
                  <PublicRoute>
                    <Onboarding />
                  </PublicRoute>
                }
              />

              {/* PROTECTED ROUTES */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
