import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import TeacherDashboard from "./TeacherDashboard";
import { getMyBest, type MyBestData } from "@/api/ranks";
import { getLocalGoalProfile } from "@/lib/localProfile";
import type { ChallengeDraft } from "./ChallengeOverview";
import { LevelProgressBar } from "@/components/home/LevelProgressBar";
import { WelcomeHero } from "@/components/home/WelcomeHero";
import { FirstSteps } from "@/components/home/FirstSteps";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { MistakeBanks } from "@/components/home/MistakeBanks";
import { BuiltForLearners } from "@/components/home/BuiltForLearners";
import { HomeFaq } from "@/components/home/HomeFaq";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [best, setBest] = useState<MyBestData | null>(null);
  const [goal] = useState(() => getLocalGoalProfile().goal);

  useEffect(() => {
    if (user?.role === "teacher") return;
    getMyBest()
      .then(setBest)
      .catch(() => {});
  }, [user?.role]);

  if (user?.role === "teacher") {
    return <TeacherDashboard />;
  }

  // No diagnostic endpoint yet — the diagnostic runs as an AI challenge on the
  // learner's goal until a dedicated post-onboarding quiz exists.
  const startDiagnostic = () => {
    const draft: ChallengeDraft = {
      topicName: `${goal} diagnostic`,
      description: `10-minute diagnostic covering the ${goal} syllabus`,
    };
    navigate("/challenge/new", { state: draft });
  };

  const isNewLearner = best?.level === 0;

  return (
    <div className="bg-white">
      <div className="bg-[linear-gradient(180deg,#f5faff_0%,#ffffff_100%)]">
        <div className="max-w-[1129px] mx-auto flex flex-col gap-10 px-4 sm:px-12 pt-6 sm:pt-8 pb-10 sm:pb-12">
          {best && <LevelProgressBar best={best} />}
          {best && isNewLearner && (
            <>
              <WelcomeHero
                name={user?.first_name}
                goal={goal}
                best={best}
                onStartDiagnostic={startDiagnostic}
              />
              <FirstSteps onStart={startDiagnostic} />
            </>
          )}
        </div>
      </div>

      <ProcessSteps />
      <MistakeBanks />
      <BuiltForLearners />
      <HomeFaq />
    </div>
  );
};

export default Home;
