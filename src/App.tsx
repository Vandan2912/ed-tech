import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
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
import PracticeSetup from "./pages/practice/PracticeSetup";
import PracticePlay from "./pages/practice/PracticePlay";
import PracticeReview from "./pages/practice/PracticeReview";

/** Keeps old /challenge links working after the move to /practice. */
function ChallengeRedirect() {
  const { quizId, attemptId } = useParams();
  const path = attemptId
    ? `/practice/${quizId}/review/${attemptId}`
    : quizId
      ? `/practice/${quizId}`
      : "/practice";
  return <Navigate to={path} replace />;
}
import PinMessage from "./pages/PinMessage";
import Engagement from "./pages/Engagement";
import Content from "./pages/Content";
import Ranks from "./pages/Rank";
import Stats from "./pages/Stats";
import Progress from "./pages/Progress";
import Study from "./pages/Study";
import Profile from "./pages/Profile";
import Certificates from "./pages/Certificates";
import StudyRoom from "./pages/StudyRoom";
import StudyRoomChat from "./pages/StudyRoomChat";
import TeacherDashboard from "./pages/TeacherDashboard";
import Homework from "./pages/Homework";
import HomeworkSubmissions from "./pages/HomeworkSubmissions";
// import PublicRoute from "./auth/PublicRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />

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
                path="/practice"
                element={
                  <ProtectedRoute>
                    <PracticeSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice/:quizId"
                element={
                  <ProtectedRoute>
                    <PracticePlay />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice/:quizId/review/:attemptId"
                element={
                  <ProtectedRoute>
                    <PracticeReview />
                  </ProtectedRoute>
                }
              />
              <Route path="/challenge/new" element={<ChallengeRedirect />} />
              <Route path="/challenge/:quizId" element={<ChallengeRedirect />} />
              <Route
                path="/challenge/:quizId/review/:attemptId"
                element={<ChallengeRedirect />}
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

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/certificates"
                element={
                  <ProtectedRoute>
                    <Certificates />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/study"
                element={
                  <ProtectedRoute>
                    <Study />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/study/:roomId"
                element={
                  <ProtectedRoute>
                    <StudyRoom />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/study/:roomId/chat"
                element={
                  <ProtectedRoute header={false} footer={false}>
                    <StudyRoomChat />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/homework"
                element={
                  <ProtectedRoute>
                    <Homework />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/homework/:homeworkId/submissions"
                element={
                  <ProtectedRoute>
                    <HomeworkSubmissions />
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
