import { Banner } from "@/components/home/banner";
import { CognitiveLoad } from "@/components/home/cognitive_load";
import { ConsistencyQuest } from "@/components/home/consistency_quest";
import { ContinueLearning } from "@/components/home/continue_learning";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { Progress } from "@/components/home/progress";
import { Recommended } from "@/components/home/recommended";
import { ResumeLearning } from "@/components/home/resume_learning";

const Home = () => {
  return (
    <div className="home min-h-screen bg-white text-gray-900">
      <main className="max-w-7xl mx-auto space-y-12 pb-24">
        <Hero />
        <Banner />
        <ResumeLearning />
        <ContinueLearning />
        <Features />
        <Progress />
        <Recommended />
        <ConsistencyQuest />
        <CognitiveLoad />
      </main>
    </div>
  );
};

export default Home;
