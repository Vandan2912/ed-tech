import { Clock, Play } from "lucide-react";

export function ResumeLearning() {
  return (
    <div className="fixed bottom-18 left-0 right-0 z-40 px-4 pb-3 mb-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 bg-blue-900 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-blue-900/20">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
            <Clock size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest leading-normal">
              Pick up where you left off
            </p>
            <p className="font-bold text-sm truncate">
              Trigonometry
              <span className="text-blue-300 ml-2 text-xs">Maths</span>
            </p>
          </div>
          <button
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
            aria-label="Resume Trigonometry">
            <Play size={14} className="fill-blue-900" />
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
