import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Pencil, X } from "lucide-react";
import {
  createQuiz,
  generateStage,
  uploadQuizSource,
  waitForStageReady,
} from "@/api/quizzes";
import { CountStepper } from "@/components/challenge/CountStepper";
import {
  STAGE_COLOR,
  STAGE_CONFIG,
  STAGE_LABEL,
  STAGE_ORDER,
} from "@/components/challenge/stages";
import { DailyGoalModal } from "@/components/practice/DailyGoalModal";
import { getDailyGoal, getTodayCount } from "@/lib/dailyGoal";
import { getApiErrorMessage } from "@/lib/utils";

/** Route state used to pre-fill the form (e.g. from the Home diagnostic). */
export type PracticeDraft = {
  topicName: string;
  description: string;
  file?: File;
};

const STAGE_BG = {
  easy: "bg-[rgba(31,193,107,0.06)]",
  medium: "bg-[rgba(245,158,11,0.06)]",
  hard: "bg-[rgba(239,68,68,0.06)]",
};

const MIN_SECONDS = 10;
const MAX_SECONDS = 60;
const SECONDS_STEP = 5;

const card =
  "bg-white border border-[#f3f4f6] rounded-2xl p-5 sm:p-6 shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)]";

export default function PracticeSetup() {
  const navigate = useNavigate();
  const draft = useLocation().state as PracticeDraft | null;

  const [topicName, setTopicName] = useState(draft?.topicName ?? "");
  const [description, setDescription] = useState(draft?.description ?? "");
  const [file, setFile] = useState<File | null>(draft?.file ?? null);
  const [seconds, setSeconds] = useState(MAX_SECONDS);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [goal, setGoal] = useState(getDailyGoal);
  const [goalOpen, setGoalOpen] = useState(false);
  const [todayCount] = useState(getTodayCount);

  const uploadRef = useRef<HTMLInputElement>(null);
  const scanRef = useRef<HTMLInputElement>(null);

  // No weak-spot API yet — the chip row stays hidden while this is empty.
  const weakSpots: string[] = [];

  const busy = progress !== null;
  const canStart = topicName.trim().length > 0 || file !== null;

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
    e.target.value = "";
  };

  const generate = async () => {
    if (!canStart) return;
    setError(null);
    try {
      setProgress("Creating your quiz...");
      const quiz = await createQuiz({
        topicName: topicName.trim() || file?.name || "My material",
        description: description.trim(),
        sourceType: file ? "file" : "topic",
        timePerQuestionSeconds: seconds,
      });

      if (file) {
        setProgress("Uploading your file...");
        await uploadQuizSource(quiz.id, file);
      }

      setProgress("Generating questions...");
      // Only the first stage: completing a stage makes the backend generate
      // the next one, and it rejects the completion ("Stage has already been
      // generated") if we generated it ourselves. The play hook still
      // generates any stage that is pending when it is entered.
      await generateStage(quiz.id, quiz.stages[0].id);
      await waitForStageReady(quiz.stages[0].id);

      navigate(`/practice/${quiz.id}`, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't start the quiz. Try again."));
      setProgress(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[linear-gradient(143deg,#f0f9ff_0%,#ffffff_50%,#eff6ff_100%)]">
      <div className="max-w-[1129px] mx-auto flex flex-col gap-6 px-4 sm:px-12 pt-8 pb-12">
        <h1 className="text-[28px] leading-9 font-bold tracking-[-0.5px] text-[#101828]">
          Practice
        </h1>
        <button
          type="button"
          onClick={() => setGoalOpen(true)}
          className="flex items-center gap-2.5 self-start text-[14px] leading-9 font-medium tracking-[-0.5px] text-[#101828]">
          {todayCount}/{goal} Daily Goal for practice questions
          <Pencil size={16} className="text-[#4a5565]" />
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <section className={`${card} flex-1 min-w-0 w-full flex flex-col gap-4`}>
            <h2 className="text-[18px] leading-[26px] font-bold text-[#101828]">
              What do you want to practise?
            </h2>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-4 font-semibold text-[#4a5565]">
                Topic Name
              </span>
              <input
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g. Fundamental Rights (Articles 12–35)"
                className="w-full px-4 py-3 rounded-xl bg-[#f7f9fc] text-[14px] leading-5 font-medium text-[#101828] placeholder:text-[#99a1af] placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[var(--auth-primary)]/40"
              />
            </label>

            {weakSpots.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] leading-4 font-medium text-[#6b7280]">
                  Recommended from your weak spots
                </span>
                {weakSpots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopicName(t)}
                    className="px-3 py-1 rounded-full bg-[rgba(19,156,237,0.1)] text-[12px] leading-4 font-semibold text-[var(--auth-primary-dark-1)]">
                    {t}
                  </button>
                ))}
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-4 font-semibold text-[#4a5565]">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Writs, Article 21 cases"
                className="w-full h-[137px] resize-none px-4 py-3 rounded-xl bg-[#f7f9fc] border border-[#e5e7eb] text-[14px] leading-5 text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:border-[var(--auth-primary)]"
              />
            </label>

            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-[#e5e7eb]" />
              <span className="text-[12px] leading-4 font-medium text-[#6b7280]">
                or use your own material
              </span>
              <span className="flex-1 h-px bg-[#e5e7eb]" />
            </div>

            {file ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#d2d5db]">
                <span className="flex-1 min-w-0 truncate text-[14px] leading-5 font-semibold text-[#101828]">
                  {file.name}
                </span>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => setFile(null)}
                  className="text-[#6b7280] hover:text-[#101828]">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => uploadRef.current?.click()}
                  className="flex flex-col items-center gap-1 py-4 rounded-xl border border-dashed border-[#d2d5db] hover:bg-[#f7f9fc]">
                  <span className="text-[14px] leading-5 font-semibold text-[#101828]">
                    Upload file
                  </span>
                  <span className="text-[12px] leading-4 text-[#6b7280]">
                    PDF · JPG · PNG
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => scanRef.current?.click()}
                  className="flex flex-col items-center gap-1 py-4 rounded-xl border border-dashed border-[#d2d5db] hover:bg-[#f7f9fc]">
                  <span className="text-[14px] leading-5 font-semibold text-[#101828]">
                    Scan a page
                  </span>
                  <span className="text-[12px] leading-4 text-[#6b7280]">
                    Use your camera
                  </span>
                </button>
              </div>
            )}
            <input
              ref={uploadRef}
              type="file"
              accept=".pdf,image/jpeg,image/png"
              className="hidden"
              onChange={pickFile}
            />
            <input
              ref={scanRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={pickFile}
            />
          </section>

          <aside className={`${card} w-full lg:w-[340px] shrink-0 flex flex-col gap-4`}>
            <h2 className="text-[16px] leading-6 font-bold text-[#101828]">
              3 stages to clear the topic
            </h2>
            {STAGE_ORDER.map((d) => {
              const cfg = STAGE_CONFIG[d];
              return (
                <div
                  key={d}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${STAGE_BG[d]}`}>
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: STAGE_COLOR[d] }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] leading-5 font-bold text-[#101828]">
                      {STAGE_LABEL[d]}
                    </p>
                    <p className="text-[12px] leading-4 text-[#4a5565]">
                      {cfg.questions} questions · {cfg.points} pts each
                    </p>
                    <p className="text-[11px] leading-[14px] font-medium text-[#6b7280]">
                      Score {cfg.passScore} / {cfg.questions * cfg.points} to
                      pass
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f9fc]">
              <p className="flex-1 text-[13px] leading-[18px] font-medium text-[#4a5565]">
                Time per question
              </p>
              <CountStepper
                label="seconds per question"
                value={seconds}
                min={MIN_SECONDS}
                max={MAX_SECONDS}
                step={SECONDS_STEP}
                suffix="s"
                onChange={setSeconds}
              />
            </div>

            <p className="text-[12px] leading-4 text-[#6b7280]">
              Clear a stage at 70%. Every answer autosaves.
            </p>

            {error && (
              <p className="px-3 py-2 rounded-xl bg-red-50 text-[13px] font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={generate}
              disabled={busy || !canStart}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[var(--auth-primary)] text-[14px] leading-5 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60">
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> {progress}
                </>
              ) : (
                "Generate quiz"
              )}
            </button>
          </aside>
        </div>
      </div>

      <DailyGoalModal
        open={goalOpen}
        onOpenChange={setGoalOpen}
        onSaved={setGoal}
      />
    </div>
  );
}
