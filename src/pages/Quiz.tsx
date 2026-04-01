import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CircleAlert, CircleCheck, X, Flame, Brain } from "lucide-react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchQuizQuestions,
  clearQuiz,
  type Option,
} from "@/store/slices/quizSlice";
import { api } from "@/lib/api";
import { useAuth } from "@/auth/useAuth";

const Quiz = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAuth();

  const { questions, loading } = useAppSelector((state) => state.quiz);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Option[]>([]);
  const [answers, setAnswers] = useState<{ question_id: number; selected_option_ids: number[] }[]>([]);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [openAbort, setOpenAbort] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchQuizQuestions(topicId));
    }
    return () => {
      dispatch(clearQuiz());
    };
  }, [dispatch, topicId]);

  if (loading) return <h2 className="p-6 min-h-[50vh]">Loading quiz...</h2>;
  if (!questions || questions.length === 0)
    return <h2 className="p-6 min-h-[50vh]">No questions found</h2>;

  const q = questions[current];

  const handleSubmit = () => {
    if (selected.length === 0) return;

    const allCorrectOptions = q.options.filter(o => o.is_correct);
    const isCurrentCorrect =
      selected.length === allCorrectOptions.length &&
      selected.every(s => s.is_correct);

    const newAnswer = {
      question_id: q.id,
      selected_option_ids: selected.map(s => s.id),
    };
    setAnswers((prev) => [...prev, newAnswer]);

    if (isCurrentCorrect) {
      setScore((prev) => prev + 1);
      toast.custom(
        () => (
          <div className="flex mx-auto gap-[10px] items-center px-[24px] h-[57px] bg-[#00c950] rounded-[16px] shadow-[0px_25px_50px_0px_#7bf1a8] w-fit pointer-events-auto">
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
        { duration: 30000, position: "top-center" },
      );
    }
    setShowAnswer(true);

    // move to next after 3 sec
    setTimeout(async () => {
      setShowAnswer(false);
      setSelected([]);
      if (current < questions.length - 1) {
        setCurrent((prev) => prev + 1);
      } else {
        try {
          const finalAnswers = [...answers, newAnswer];
          await api.post(`/course/quiz/${(q as any).quiz_id || (questions[0] as any)?.quiz_id}/submit`, {
            answers: finalAnswers
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (err) {
          console.error("Failed to submit quiz", err);
        }
        setShowResult(true);
      }
    }, 3000);
  };

  const total = questions.length;
  const isCurrentCorrectPending = q ? (selected.length > 0 && selected.length === q.options.filter(o => o.is_correct).length && selected.every(s => s.is_correct)) : false;
  const finalScore = score + (isCurrentCorrectPending ? 1 : 0);
  const percentage = Math.round((finalScore / total) * 100);

  const isPassed = percentage >= 70;

  if (showResult) {
    return (
      <div className="min-h-screen bg-white p-6 md:pl-28 flex flex-col items-center justify-center pt-16">
        {/* Icon */}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shrink-0 ${isPassed ? "bg-[#dcfce7] text-[#00a63e]" : "bg-red-100 text-red-600"
            }`}
        >
          {isPassed ? (
            <CircleCheck size={48} strokeWidth={2.5} />
          ) : (
            <CircleAlert size={48} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-[30px] font-bold text-[#101828] tracking-[0.3955px] mb-2">
          {isPassed ? "Quest Mastered!" : "Target Not Met"}
        </h2>

        {/* Description */}
        <p className="text-[#6a7282] text-[16px] mb-10 text-center tracking-[-0.3125px] max-w-sm">
          {isPassed
            ? `Fantastic work! You scored ${percentage}/100 and maintained your streak.`
            : `You scored ${percentage}/100. A minimum of 70 is required to progress this challenge.`}
        </p>

        {/* Metrics Container */}
        <div className="w-full max-w-[384px] space-y-4 pb-20">
          {/* Main Metrics Box */}
          <div className="bg-[#f9fafb] border border-[#f3f4f6] p-6 rounded-[24px]">
            <h4 className="text-[14px] font-semibold text-[#6a7282] uppercase tracking-[0.5496px] text-center mb-6">
              Challenge Metrics
            </h4>

            <div className="flex justify-between items-center mb-6">
              <span className="text-[#4a5565] text-[16px] tracking-[-0.3125px]">
                Quest Accuracy
              </span>
              <span
                className={`font-bold text-[16px] tracking-[-0.3125px] ${isPassed ? "text-[#00a63e]" : "text-red-500"}`}
              >
                {percentage}%
              </span>
            </div>

            <div className="flex justify-between items-center mb-5">
              <span className="text-[#4a5565] text-[16px] tracking-[-0.3125px]">
                Points Earned
              </span>
              <span className="font-bold text-[#155dfc] text-[16px] tracking-[-0.3125px]">
                +{isPassed ? percentage + 25 : 0} XP
              </span>
            </div>

            {/* Bonus Badge */}
            {isPassed && (
              <div className="bg-[#d0fae5] rounded-[10px] py-[6px] w-full mt-2">
                <p className="font-black text-[#007a55] text-[10px] uppercase text-center tracking-[0.1172px]">
                  Misconception Fixed Bonus Included!
                </p>
              </div>
            )}
          </div>

          {/* Streak Bonus Card */}
          {isPassed && (
            <div className="bg-[#f54900] rounded-[24px] p-4 flex items-center gap-3 sm:gap-4 shadow-[0px_20px_25px_0px_#ffd6a8,0px_8px_10px_0px_#ffd6a8]">
              <div className="bg-white/20 rounded-[16px] w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] shrink-0 flex items-center justify-center">
                <Flame className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#ffedd4] text-[10px] sm:text-[12px] uppercase tracking-[1.2px]">
                  Streak Bonus
                </span>
                <span className="font-bold text-white text-[14px] sm:text-[16px] tracking-[-0.3125px] mt-0.5">
                  Consistency +1 Day
                </span>
              </div>
            </div>
          )}

          {/* Correction Streak Card */}
          {isPassed && (
            <div className="bg-[#009966] rounded-[24px] p-4 flex items-center gap-3 sm:gap-4 shadow-[0px_20px_25px_0px_#a4f4cf,0px_8px_10px_0px_#a4f4cf]">
              <div className="bg-white/20 rounded-[16px] w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] shrink-0 flex items-center justify-center">
                <Brain className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#d0fae5] text-[10px] sm:text-[12px] uppercase tracking-[1.2px]">
                  Correction Streak
                </span>
                <span className="font-bold text-white text-[14px] sm:text-[16px] tracking-[-0.3125px] mt-0.5">
                  Fixed Myth! +75 XP
                </span>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => {
              setShowResult(false);
              setCurrent(0);
              setScore(0);
              setAnswers([]);
              if (isPassed) {
                navigate(`/courses/${courseId}`);
              }
            }}
            className="w-full h-[56px] mt-4 bg-[#101828] text-white rounded-[16px] font-bold text-[16px] tracking-[-0.3125px] hover:bg-black transition-colors shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]"
          >
            {isPassed ? "Collect Rewards" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6 md:pl-28">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* 📊 Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <span className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-widest">
              AI Generated Quiz
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm text-gray-400 font-semibold">
                Question {current + 1} of {questions.length}
              </span>

              <button
                onClick={() => setOpenAbort(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
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
        <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
            {q.question_text}
          </h2>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            {(q as any).question_type === "multiple" ? "Select all correct answers below, then submit" : "Select an answer below, then submit"}
          </p>
          <div className="grid gap-4">
            {q.options.map((opt, i) => {
              const isCorrect = opt.is_correct;
              const isSelected = selected.some(s => s.id === opt.id);
              const percentPicked = Math.floor(0.4 * 70);

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    if ((q as any).question_type === "multiple") {
                      setSelected(prev =>
                        prev.some(o => o.id === opt.id)
                          ? prev.filter(o => o.id !== opt.id)
                          : [...prev, opt]
                      );
                    } else {
                      setSelected([opt]);
                    }
                  }}
                  className={`relative w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 sm:gap-5
                    ${showAnswer
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
                    className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-all ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}
                    ${showAnswer
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
                  <span className="font-semibold flex-1 text-sm sm:text-base">
                    {opt.option_text}
                  </span>
                  {isSelected && !showAnswer && (
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
          <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
            <button
              disabled={selected.length === 0}
              onClick={handleSubmit}
              className="flex-1 py-3.5 sm:py-4 bg-blue-600 text-white rounded-2xl font-black text-[12px] sm:text-sm uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              <CircleCheck size={20} />
              Submit Answer
            </button>

            <button
              onClick={() => setOpenAbort(true)}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-[12px] sm:text-sm uppercase tracking-widest hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                onClick={() => {
                  setOpenAbort(false);
                }}
              >
                Keep Going
              </button>
              <button
                className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
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
