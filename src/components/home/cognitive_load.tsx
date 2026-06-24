import { motion } from "motion/react";
import { Brain, ChevronRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { CognitiveMetrics } from "@/api/home";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

const chartData = [
  { load: 40 },
  { load: 50 },
  { load: 55 },
  { load: 52 },
  { load: 45 },
  { load: 30 },
  { load: 35 },
  { load: 55 },
  { load: 80 },
];

interface Props {
  metrics?: CognitiveMetrics;
}

export function CognitiveLoad({ metrics }: Props) {
  const t = useTranslation();
  return (
    <section className="px-6 py-5 md:py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="justify-between bg-gray-900 rounded-[40px] p-6 md:p-10 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>

        <div className="lg:w-1/2 relative z-10 flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 bg-[#2B7FFF1A] rounded-full px-4 py-1.5 text-xs uppercase text-[#51A2FF] text-[10px] not-italic font-bold leading-3.75 tracking-[0.117px]">
            <Brain size={14} className="text-blue-400" />
            <span>{t.cognitiveLoad.badge}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {t.cognitiveLoad.heading} <br />
            <span className="text-[#51A2FF]">{t.cognitiveLoad.headingHighlight}</span>
          </h2>

          <p className="max-w-md text-[#99A1AF] text-xs not-italic font-normal leading-[19.5px]">
            {t.cognitiveLoad.description}
          </p>

          <div className="flex items-center gap-8">
            <div>
              <div className="text-white text-center text-lg not-italic font-bold leading-7 tracking-[-0.439px]">
                {metrics?.efficiency ?? "—"}
              </div>
              <div className="text-[#6A7282] text-center text-[9px] not-italic font-bold leading-[13.5px] tracking-[1.067px] uppercase">
                {t.cognitiveLoad.efficiency}
              </div>
            </div>
            <div>
              <div className="text-white text-center text-lg not-italic font-bold leading-7 tracking-[-0.439px]">
                {metrics?.hours_learned != null
                  ? `${metrics.hours_learned}h`
                  : "—"}
              </div>
              <div className="text-[#6A7282] text-center text-[9px] not-italic font-bold leading-[13.5px] tracking-[1.067px] uppercase">
                {t.cognitiveLoad.hoursLearned}
              </div>
            </div>
            <Link
              to="/stats"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/20 leading-normal">
              {t.cognitiveLoad.viewAnalytics} <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 w-full h-50 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-2xl p-5 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="load"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#areaGradient)"
                dot={false}
                activeDot={false}
              />

              {/* dashed highlight line */}
              <Area
                type="monotone"
                dataKey="load"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="6 6"
                fill="transparent"
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
