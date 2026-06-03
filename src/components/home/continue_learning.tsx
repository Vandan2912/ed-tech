import { motion } from "motion/react";
import { Clock, Play } from "lucide-react";
import type { ContinueLearningItem } from "@/api/home";
import { useAppSelector } from "@/store/store";
import { useNavigate } from "react-router-dom";

interface Props {
  courses?: ContinueLearningItem[];
}

export function ContinueLearning({ courses }: Props) {
  const subjects = useAppSelector((state) => state.course.subjects);
  const navigate = useNavigate();

  const inProgress = courses?.filter((c) => c.progress_percent < 100) ?? [];

  if (inProgress.length === 0) return null;

  function handleResume(subjectId: number) {
    const subject = subjects.find((s) => s.id === subjectId);
    const topicId = subject?.topics?.[0]?.id;
    if (topicId) {
      navigate(`/courses/${subjectId}/${topicId}`);
    } else {
      navigate(`/courses/${subjectId}`);
    }
  }

  return (
    <section className="px-6 pt-11 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
          <Clock stroke="currentColor" className="size-6 " />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
          <p className="text-sm text-gray-500">Pick up where you left off</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inProgress.map((course, idx) => (
          <motion.div
            key={course.subject_id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <img
                  src={`/icons/${course.icon}`}
                  alt={course.subject_name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/book.svg";
                  }}
                />
              </div>
            </div>

            <h3 className="text-[#101828] text-xl not-italic font-bold leading-7 tracking-[-0.449px] mb-2">
              {course.subject_name}
            </h3>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[#99A1AF] text-xs not-italic font-bold leading-4">Progress</span>
                <span className="text-blue-600">{course.progress_percent}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${course.progress_percent}%` }}></div>
              </div>
            </div>

            <button
              onClick={() => handleResume(course.subject_id)}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] py-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-white text-center text-base not-italic font-bold leading-6 tracking-[-0.312px]">
              <Play size={18} className="fill-white" /> Resume Lesson
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
