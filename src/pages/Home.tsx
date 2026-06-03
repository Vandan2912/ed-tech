import { Banner } from "@/components/home/banner";
import { CognitiveLoad } from "@/components/home/cognitive_load";
import { ConsistencyQuest } from "@/components/home/consistency_quest";
import { ContinueLearning } from "@/components/home/continue_learning";
import { Features } from "@/components/home/features";
import { ProblemOfTheDay } from "@/components/home/problem_of_the_day";
import { Hero } from "@/components/home/hero";
import { Progress } from "@/components/home/progress";
import { Recommended } from "@/components/home/recommended";
import { ResumeLearning } from "@/components/home/resume_learning";
import { useAuth } from "@/auth/useAuth";
import TeacherDashboard from "./TeacherDashboard";
import { useEffect, useState } from "react";
import { getHomeOverview, type HomeOverview } from "@/api/home";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";

const Home = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<HomeOverview | null>(null);
  const dispatch = useAppDispatch();
  const subjects = useAppSelector((state) => state.course.subjects);

  useEffect(() => {
    if (user?.role !== "teacher") {
      getHomeOverview().then(setOverview).catch(console.error);
      if (subjects.length === 0) {
        dispatch(fetchCourses());
      }
    }
  }, [user]);

  if (user?.role === "teacher") {
    return <TeacherDashboard />;
  }
  return (
    <div className="home min-h-screen bg-white text-gray-900">
      <main className="max-w-7xl mx-auto space-y-12 pb-24">
        <Hero />
        <Banner />
        <ResumeLearning courses={overview?.continue_learning} />
        <ContinueLearning courses={overview?.continue_learning} />
        <ProblemOfTheDay />
        <Features />
        <Progress summary={overview?.progress_summary} />
        <Recommended />
        <ConsistencyQuest />
        <CognitiveLoad metrics={overview?.cognitive_metrics} />
      </main>
    </div>
  );
};

export default Home;
