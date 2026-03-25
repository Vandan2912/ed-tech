import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import courses from "@/lib/courses.json";
import type { Course as CourseType } from "@/types/course";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Quiz = () => {
  const { courseSlug, topicSlug } = useParams();
  const navigate = useNavigate();

  const course = (courses as CourseType[]).find((c) => c.slug === courseSlug);

  const topic = course?.topics.find((t) => t.slug === topicSlug);

  const questions = topic?.quiz || [];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [openAbort, setOpenAbort] = useState(false);
  const [showResult, setShowResult] = useState(false);

  if (!course || !topic) return <h2 className="p-6">Quiz not found</h2>;

  const q = questions[current];

  const handleSubmit = () => {
    if (!selected) return;

    if (selected === q.answer) {
      setScore((prev) => prev + 1);
      toast.custom(
        () => (
          <div className="flex gap-[10px] items-center px-[24px] h-[57px] bg-[#00c950] rounded-[16px] shadow-[0px_25px_50px_0px_#7bf1a8] w-fit pointer-events-auto">
            <div className="bg-white/20 relative rounded-[14px] shrink-0 w-[32px] h-[32px] flex items-center justify-center">
              <CircleCheck size={16} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col items-start justify-center">
              <p className="font-black leading-[18px] text-[18px] text-white tracking-[-0.4395px] m-0">
                +25 XP
              </p>
              <p className="font-bold leading-[15px] text-[#dcfce7] text-[10px] tracking-[1.1172px] uppercase m-0 mt-0.5">
                Correct Answer!
              </p>
            </div>
          </div>
        ),
        { duration: 3000, position: "top-center" },
      );
    }
    setShowAnswer(true);

    // move to next after 5 sec
    setTimeout(() => {
      setShowAnswer(false);
      setSelected(null);
      if (current < questions.length - 1) {
        setCurrent((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 3000);
  };

  const total = questions.length;
  const finalScore = score + (selected === q.answer ? 1 : 0);
  const percentage = Math.round((finalScore / total) * 100);

  const isPassed = percentage >= 70;

  if (showResult) {
    return (
      <div className="min-h-screen bg-white p-6 md:pl-28 flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
            isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {isPassed ? <CircleCheck size={48} /> : <CircleAlert size={48} />}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isPassed ? "Target Achieved" : "Target Not Met"}
        </h2>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          You scored {percentage}/100. A minimum of 70 is required to progress
          this challenge.
        </p>

        {/* Metrics */}
        <div className="w-full max-w-sm space-y-4">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Challenge Metrics
            </h4>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Quest Accuracy</span>
              <span
                className={`font-bold ${isPassed ? "text-green-500" : "text-red-500"}`}
              >
                {percentage}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Points Earned</span>
              <span className="font-bold text-blue-600">
                +{isPassed ? percentage : 0} XP
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              setShowResult(false);
              setCurrent(0);
              setScore(0);
              if (isPassed) {
                navigate(`/courses/${course.slug}`);
              }
            }}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors shadow-lg"
          >
            {isPassed ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6 md:pl-28">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* 📊 Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
              AI Generated Quiz
            </span>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                Question {current + 1} of {questions.length}
              </span>

              <button
                onClick={() => setOpenAbort(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Abort quiz"
              >
                <X size={14} />
                Abort
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all"
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* ❓ Question */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">{q.question}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Select an answer below, then submit
          </p>
          <div className="grid gap-4">
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.answer;
              const isSelected = selected === opt;
              const percentPicked = Math.floor(0.4 * 70);

              return (
                <button
                  key={i}
                  onClick={() => setSelected(opt)}
                  className={`relative w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-5
                    ${
                      showAnswer
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : isSelected
                            ? "border-red-500 bg-red-50"
                            : "border-[#F3F4F6] opacity-50"
                        : isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-100 hover:border-blue-400"
                    }
                `}
                >
                  <div
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black transition-all ${selected === opt ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}
                    ${
                      showAnswer
                        ? isCorrect
                          ? "bg-green-500 text-white"
                          : isSelected
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        : isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500"
                    }
                    `}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-semibold flex-1">{opt}</span>
                  {selected === opt && !showAnswer && (
                    <CircleCheck size={20} className="text-blue-600" />
                  )}
                  {showAnswer && (
                    <div className="flex items-center gap-2 text-sm">
                      {/* % picked (mock for now) */}
                      <span className="text-gray-400">
                        {percentPicked}% picked
                      </span>

                      {/* Icons */}
                      {isCorrect && (
                        <CircleCheck size={20} className="text-green-600" />
                      )}
                      {isSelected && !isCorrect && (
                        <CircleAlert size={20} className="text-red-600" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              disabled={!selected}
              onClick={handleSubmit}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              <CircleCheck size={20} />
              Submit Answer
            </button>

            <button
              onClick={() => setOpenAbort(true)}
              className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X size={20} />
              Abort
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={openAbort} onOpenChange={setOpenAbort}>
        <AlertDialogContent className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 text-center border-none">
          <div className="relative">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CircleAlert size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Abort this quiz?
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Your progress on this quiz will be lost and no XP will be awarded.
              You can retake it anytime.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                onClick={() => {
                  setOpenAbort(false);
                }}
              >
                Keep Going
              </button>
              <button
                className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
                onClick={() => {
                  setOpenAbort(false);
                  navigate(-1);
                }}
              >
                Yes, Abort
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Quiz;
