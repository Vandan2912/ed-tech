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
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Topic from "./pages/Topic";
import Quiz from "./pages/Quiz";
import PinMessage from "./pages/PinMessage";
import Engagement from "./pages/Engagement";
import Content from "./pages/Content";
import Ranks from "./pages/Rank";
import Stats from "./pages/Stats";
import Progress from "./pages/Progress";
// import PublicRoute from "./auth/PublicRoute";

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
              <Route path="/login" element={<Login />} />

              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute header={false} footer={false}>
                    <Onboarding />
                  </ProtectedRoute>
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
              <Route
                path="/pin-message"
                element={
                  <ProtectedRoute>
                    <PinMessage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/engagement"
                element={
                  <ProtectedRoute>
                    <Engagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content"
                element={
                  <ProtectedRoute>
                    <Content />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId"
                element={
                  <ProtectedRoute>
                    <Course />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/:topicId"
                element={
                  <ProtectedRoute>
                    <Topic />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/:topicId/quiz"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ranks"
                element={
                  <ProtectedRoute>
                    <Ranks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Progress />
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
