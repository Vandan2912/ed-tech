import { Clock, Play } from "lucide-react";
import type { ContinueLearningItem } from "@/api/home";
import { useAppSelector } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

interface Props {
  courses?: ContinueLearningItem[];
}

export function ResumeLearning({ courses }: Props) {
  const subjects = useAppSelector((state) => state.course.subjects);
  const navigate = useNavigate();
  const t = useTranslation();

  const next = courses?.find((c) => c.progress_percent < 100);
  if (!next) return null;

  function handleResume() {
    if (!next) return;
    const subject = subjects.find((s) => s.id === next.subject_id);
    const topicId = subject?.topics?.[0]?.id;
    if (topicId) {
      navigate(`/courses/${next.subject_id}/${topicId}`);
    } else {
      navigate(`/courses/${next.subject_id}`);
    }
  }

  return (
    <div className="fixed bottom-18 md:bottom-2 left-0 right-0 z-40 px-4 pb-3 mb-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 bg-blue-900 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-blue-900/20">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
            <Clock size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest leading-normal">
              {t.resumeLearning.pickUp}
            </p>
            <p className="font-bold text-sm truncate">
              {next.subject_name}
              <span className="text-blue-300 ml-2 text-xs">
                {next.progress_percent}%
              </span>
            </p>
          </div>
          <button
            onClick={handleResume}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
            aria-label={`Resume ${next.subject_name}`}>
            <Play size={14} className="fill-blue-900" />
            {t.resumeLearning.resume}
          </button>
        </div>
      </div>
    </div>
  );
}
