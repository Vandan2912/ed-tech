import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  Camera,
  FileText,
  Lightbulb,
  Mic,
  Paperclip,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChallengeDraft } from "@/pages/ChallengeOverview";

type Tab = "challenge" | "doubts";

const SUGGESTIONS = [
  "Explain Newton's Laws of Motion",
  "Solve this algebra quadratic equation",
  "Summarize cellular respiration in biology",
  "Help me understand photosynthesis step-by-step",
];

export function AiPanel() {
  const [tab, setTab] = useState<Tab>("challenge");
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const canStart = topicName.trim() !== "" && description.trim() !== "";

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
    e.target.value = ""; // allow re-picking the same file
  };

  const startChallenge = () => {
    if (!canStart) return;
    const draft: ChallengeDraft = {
      topicName: topicName.trim(),
      description: description.trim(),
      file: file ?? undefined,
    };
    navigate("/challenge/new", { state: draft });
  };

  return (
    <div className="rounded-[20px] sm:rounded-2xl border border-[#f3f4f6] sm:border-[#f0f9ff] bg-white overflow-hidden shadow-[0px_16px_40px_-8px_rgba(88,92,95,0.11)] sm:shadow-none">
      <div className="flex items-end sm:gap-1 bg-[#f3f4f6]">
        <button
          type="button"
          onClick={() => setTab("challenge")}
          className={cn(
            "flex flex-1 sm:flex-none flex-col items-center sm:items-stretch gap-1 px-4 py-3 sm:pt-3 sm:pb-2.5 sm:rounded-t-md",
            tab === "challenge" ? "bg-white" : "bg-[#f3f4f6]",
          )}>
          <span
            className={cn(
              "text-[13px] sm:text-[14px]",
              tab === "challenge"
                ? "font-bold text-[#101828]"
                : "font-medium text-[var(--auth-neutral-600)]",
            )}>
            AI Challenge
          </span>
          {tab === "challenge" && (
            <span className="h-[3px] w-[60px] sm:w-full rounded-full bg-[var(--auth-primary)]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("doubts")}
          className={cn(
            "flex flex-1 sm:flex-none flex-col items-center sm:items-stretch gap-1 px-4 py-3 sm:pt-3 sm:pb-2.5 sm:rounded-t-md",
            tab === "doubts" ? "bg-white" : "bg-[#f3f4f6]",
          )}>
          <span
            className={cn(
              "text-[13px] sm:text-[14px]",
              tab === "doubts"
                ? "font-bold text-[#101828]"
                : "font-medium text-[var(--auth-neutral-600)]",
            )}>
            <span className="sm:hidden">Ask AI Doubts</span>
            <span className="hidden sm:inline">Ask Doubts with AI</span>
          </span>
          {tab === "doubts" && (
            <span className="h-[3px] w-[60px] sm:w-full rounded-full bg-[var(--auth-primary)]" />
          )}
        </button>
      </div>

      {tab === "challenge" ? (
        <div>
          <div className="hidden sm:block px-6 pt-5 pb-4 border-b border-[#efefef]">
            <h3 className="text-[15px] font-bold text-[#101828]">
              Generate Your Quiz
            </h3>
            <p className="pt-1 text-[11px] font-semibold text-[var(--auth-neutral-700)]">
              Powered by AI · Any topic · Any time
            </p>
          </div>

          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div>
              <label className="block pb-1.5 sm:pb-2 text-[12px] sm:text-[13px] font-bold text-[#6b7280] sm:text-[var(--auth-neutral-600)]">
                Topic name *
              </label>
              <input
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g. Newton's Laws of Motion, DNA and Heredity..."
                className="w-full h-11 sm:h-[52px] px-3 sm:px-4 rounded-xl sm:rounded-2xl border-2 border-[#f3f4f6] bg-[#f9fafb] text-[13px] sm:text-[12px] font-medium placeholder:text-[var(--auth-neutral-400)] focus:outline-none focus:border-[var(--auth-primary)]"
              />
            </div>

            <div>
              <label className="block pb-1.5 sm:pb-2 text-[12px] sm:text-[13px] font-bold text-[#6b7280] sm:text-[var(--auth-neutral-600)]">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context about what to focus on — helps AI tailor the questions..."
                rows={3}
                className="w-full h-[60px] sm:h-auto px-3 sm:px-4 py-3 rounded-xl sm:rounded-2xl border-2 border-[#f3f4f6] bg-[#f9fafb] text-[13px] sm:text-[12px] font-medium placeholder:text-[var(--auth-neutral-400)] focus:outline-none focus:border-[var(--auth-primary)] resize-none"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex-1 h-px bg-[#f3f4f6]" />
              <span className="text-[11px] sm:text-[13px] font-semibold sm:font-bold uppercase sm:normal-case text-[var(--auth-neutral-700)] whitespace-nowrap">
                or scan a page
              </span>
              <span className="flex-1 h-px bg-[#f3f4f6]" />
            </div>

            <div className="flex gap-3">
              <input
                ref={uploadInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFilePicked}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onFilePicked}
              />
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="flex-1 flex flex-col items-center gap-1 sm:gap-2.5 p-3 sm:px-4 sm:py-5 rounded-xl sm:rounded-2xl border-2 border-dashed border-[#f3f4f6] sm:border-[#e5e7eb] bg-[#333]/[0.02] sm:bg-transparent transition-colors hover:border-[var(--auth-primary)]/40">
                <span className="flex items-center justify-center size-5 sm:size-10 rounded-full sm:bg-[#f3f4f6]">
                  <Upload size={20} className="text-[#99a1af]" />
                </span>
                <span className="text-center">
                  <span className="block text-[13px] sm:text-[15px] font-semibold text-[#1e2939] sm:text-[var(--auth-neutral-900)]">
                    Upload File
                  </span>
                  <span className="hidden sm:block pt-0.5 text-[11px] font-medium text-[var(--auth-neutral-500)]">
                    PDF · JPG · PNG · WEBP
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex flex-col items-center gap-1 sm:gap-2.5 p-3 sm:px-4 sm:py-5 rounded-xl sm:rounded-2xl border-2 border-dashed border-[#f3f4f6] sm:border-[#e5e7eb] bg-[#333]/[0.02] sm:bg-transparent transition-colors hover:border-[var(--auth-primary)]/40">
                <span className="flex items-center justify-center size-5 sm:size-10 rounded-full sm:bg-[#f3f4f6]">
                  <Camera size={20} className="text-[#99a1af]" />
                </span>
                <span className="text-center">
                  <span className="block text-[13px] sm:text-[15px] font-semibold text-[#1e2939] sm:text-[var(--auth-neutral-900)]">
                    Scan
                  </span>
                  <span className="hidden sm:block pt-0.5 text-[11px] font-medium text-[var(--auth-neutral-500)]">
                    Open camera to scan
                  </span>
                </span>
              </button>
            </div>

            {file && (
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#cfebfb] bg-[#f0f9ff]">
                <FileText
                  size={16}
                  className="shrink-0 text-[var(--auth-primary)]"
                />
                <span className="flex-1 min-w-0 truncate text-[12px] font-semibold text-[#1e2939]">
                  {file.name}
                </span>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => setFile(null)}
                  className="flex items-center justify-center size-6 rounded-full text-[#6b7280] hover:bg-white">
                  <X size={14} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={startChallenge}
              disabled={!canStart}
              title={canStart ? undefined : "Enter a topic and description"}
              className="flex items-center justify-center gap-2.5 h-12 rounded-xl sm:rounded-[10px] drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] sm:drop-shadow-none bg-[var(--auth-primary)] text-[16px] font-bold text-white transition active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100">
              <Sparkles size={20} />
              Start Challenge
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="flex flex-col items-center gap-6 px-6 pt-10 pb-6 text-center relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(157deg, #ffffff 25%, #f5f3ff 75%)",
            }}>
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[235px] rounded-full border border-[var(--auth-primary)]/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[183px] rounded-full border border-[var(--auth-primary)]/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[130px] rounded-full border border-[var(--auth-primary)]/10" />

            <div className="relative flex flex-col gap-1.5 max-w-md">
              <h3
                className="text-[21px] font-black bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(92deg, #9ed6f8 0%, #1223a8 88%)",
                }}>
                Ask anything with Mastishq AI
              </h3>
              <p className="text-[10px] text-[var(--auth-neutral-600)]">
                Your AI-powered study companion. Ask doubts, get explanations,
                and learn faster.
              </p>
            </div>

            <div className="relative flex flex-wrap items-center justify-center gap-2 max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuestion(s)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[var(--auth-primary)] bg-white/60 backdrop-blur-sm shadow-[0px_7px_16px_rgba(62,174,240,0.12)]">
                  <Lightbulb size={10} className="text-[var(--auth-primary)]" />
                  <span className="text-[9px] font-medium text-[#101828] whitespace-nowrap">
                    {s}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 px-4 py-3.5 border-t border-[#e5e7eb]">
            <div className="flex w-full max-w-[522px] items-end gap-2 rounded-xl border border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] bg-gradient-to-r from-white/35 to-transparent shadow-[0px_8px_18px_rgba(80,162,234,0.23)] pl-2.5 pr-1.5 py-3">
              <span className="flex items-center justify-center size-6 rounded-full border border-[#e5e7eb] bg-white shrink-0">
                <Paperclip size={12} className="text-[var(--auth-neutral-400)]" />
              </span>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask Mastishq AI anything..."
                className="flex-1 text-[9px] text-[var(--auth-neutral-600)] focus:outline-none"
              />
              <button
                type="button"
                title="Coming soon"
                disabled
                className="flex items-center justify-center size-[18px] rounded shrink-0 text-[var(--auth-neutral-500)]">
                <Mic size={11} />
              </button>
              <button
                type="button"
                title="Coming soon"
                disabled
                className="flex items-center justify-center size-[18px] rounded bg-[var(--auth-primary-dark-3)] shrink-0 disabled:opacity-70">
                <ArrowUp size={11} className="text-white" />
              </button>
            </div>
            <p className="text-[8px] text-[var(--auth-neutral-600)]">
              Attach documents, images, or PDFs for context
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
