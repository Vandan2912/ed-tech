import { motion } from "motion/react";
import {
  Zap,
  ChevronRight,
  ChartColumn,
  Atom,
  FlaskConical,
  Dna,
  Layers,
  Globe,
  BookOpen,
  Calculator,
  Microscope,
  Languages,
  Music,
  Palette,
  Code2,
  HeartPulse,
  Leaf,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { useAppSelector } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

const SUBJECT_COLORS: Record<string, string> = {
  maths: "bg-[#155DFC]",
  mathematics: "bg-[#155DFC]",
  physics: "bg-[#4F39F6]",
  chemistry: "bg-[#009966]",
  biology: "bg-[#EC003F]",
  history: "bg-[#F54900]",
  geography: "bg-[#009689]",
  english: "bg-[#7C3AED]",
  literature: "bg-[#7C3AED]",
  computer: "bg-[#0EA5E9]",
  science: "bg-[#0EA5E9]",
  music: "bg-[#DB2777]",
  art: "bg-[#F59E0B]",
  economics: "bg-[#10B981]",
  health: "bg-[#EF4444]",
  environment: "bg-[#22C55E]",
  civics: "bg-[#6366F1]",
};

const FALLBACK_COLORS = [
  "bg-[#155DFC]",
  "bg-[#4F39F6]",
  "bg-[#009966]",
  "bg-[#EC003F]",
  "bg-[#F54900]",
  "bg-[#009689]",
  "bg-[#7C3AED]",
  "bg-[#DB2777]",
];

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  maths: ChartColumn,
  mathematics: ChartColumn,
  calculus: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  history: Layers,
  geography: Globe,
  english: Languages,
  literature: Languages,
  computer: Code2,
  science: Microscope,
  music: Music,
  art: Palette,
  economics: Landmark,
  health: HeartPulse,
  environment: Leaf,
  civics: Landmark,
};

function getSubjectColor(name: string, idx: number): string {
  const key = name.toLowerCase().split(" ")[0];
  return SUBJECT_COLORS[key] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

function getSubjectIcon(name: string): LucideIcon {
  const key = name.toLowerCase().split(" ")[0];
  return SUBJECT_ICONS[key] ?? BookOpen;
}

export function ConsistencyQuest() {
  const subjects = useAppSelector((state) => state.course.subjects);
  const navigate = useNavigate();
  const t = useTranslation();

  if (subjects.length === 0) return null;

  return (
    <section className="px-6 py-5 md:py-16 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] flex flex-col lg:flex-row gap-12 items-center justify-between p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="space-y-6 flex-1">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 text-xs  text-[#F54900] text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase">
            <Zap size={12} fill="currentColor" />
            <span>{t.consistencyQuest.badge}</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            {t.consistencyQuest.heading} <span className="text-orange-500">{t.consistencyQuest.headingHighlight}</span>{" "}
            {t.consistencyQuest.headingEnd}
          </h2>

          <p className="max-w-md text-[#6A7282] text-sm not-italic font-normal leading-[22.75px] tracking-[-0.15px]">
            {t.consistencyQuest.description1}{" "}
            <span className="font-bold text-[#101828]">
              {t.consistencyQuest.eliteBadge}
            </span>{" "}
            {t.consistencyQuest.description2} <span className="font-bold text-[#F54900]">{t.consistencyQuest.xp}</span>{t.consistencyQuest.description3}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
              onClick={() => navigate("/courses")}
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
              {t.consistencyQuest.joinChallenge} <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="shrink-0 md:min-w-[40%] md:w-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {subjects.slice(0, 6).map((subject, idx) => (
              <motion.div
                key={subject.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/courses/${subject.id}`)}
                className="bg-[#F9FAFB80] rounded-2xl p-4.25 flex flex-col items-center justify-center text-center gap-4 border border-[#00000000] transition-all hover:shadow-md cursor-pointer">
                {(() => {
                  const Icon = getSubjectIcon(subject.name);
                  return (
                    <div
                      className={`shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] flex w-9 h-9 justify-center items-center rounded-[14px] ${getSubjectColor(subject.name, idx)}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                  );
                })()}
                <div>
                  <div className="text-[#101828] text-center text-xs not-italic font-bold leading-4">
                    {subject.name}
                  </div>
                  <div className="text-[#99A1AF] text-center text-[8px] not-italic font-bold leading-3 tracking-[1.006px] uppercase">
                    {subject.topics?.length ?? 0} {t.consistencyQuest.topics}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/courses/${subject.id}`);
                  }}
                  className="text-center text-blue-600 bg-[#EFF6FF] text-[8px] font-black uppercase leading-3 tracking-wide inline-flex justify-center items-center border pl-[16.938px] pr-[16.063px] pt-[9.5px] pb-[8.5px] rounded-[14px] border-solid border-[rgba(219,234,254,0.50)]">
                  {t.consistencyQuest.enrollNow}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
