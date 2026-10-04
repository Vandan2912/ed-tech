import { useEffect } from "react";
import { useAuth } from "@/auth/useAuth";
import TeacherDashboard from "./TeacherDashboard";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { Hero } from "@/components/home/Hero";
import { LevelProgressCard } from "@/components/home/LevelProgressCard";
import { AiPanel } from "@/components/home/AiPanel";
import { MostSearchedTopics } from "@/components/home/MostSearchedTopics";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { QuizStructure } from "@/components/home/QuizStructure";
import { BuiltForLearners } from "@/components/home/BuiltForLearners";

const Home = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const subjects = useAppSelector((state) => state.course.subjects);

  useEffect(() => {
    if (user?.role !== "teacher" && subjects.length === 0) {
      dispatch(fetchCourses());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user?.role === "teacher") {
    return <TeacherDashboard />;
  }

  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#eff6ff] to-white">
        <div className="pointer-events-none absolute -top-20 left-[10%] size-[366px] rounded-full bg-[var(--auth-primary)]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-[20%] right-[5%] size-[420px] rounded-full bg-[var(--auth-secondary-light-2)]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[30%] size-[380px] rounded-full bg-[var(--auth-primary)]/10 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 pb-16">
          <Hero />
          <div className="pt-8">
            <LevelProgressCard />
          </div>
          <div className="pt-6">
            <AiPanel />
          </div>
          <div className="pt-12">
            <MostSearchedTopics />
          </div>
        </div>
      </div>

      <ProcessSteps />
      <QuizStructure />
      <BuiltForLearners />
    </div>
  );
};

export default Home;
