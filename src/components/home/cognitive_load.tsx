import { motion } from "motion/react";
import { Brain, ChevronRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
const data = [
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

export function CognitiveLoad() {
  return (
    <section className="px-8 py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#111827] rounded-[2rem] p-10 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-16 items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-95 h-95 bg-[#155DFC33] rounded-full blur-[120px] "></div>
        </div>

        <div className="lg:w-1/2 relative z-10 flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 bg-[#2B7FFF1A] rounded-full px-4 py-1.5 text-xs uppercase text-[#51A2FF] text-[10px] not-italic font-bold leading-3.75 tracking-[0.117px]">
            <Brain size={14} className="text-blue-400" />
            <span>COGNITIVE TRACKING</span>
          </div>

          <h2 className="text-white text-3xl not-italic font-bold leading-[37.5px] tracking-[0.396px]">
            Understand Your <br />
            <span className="text-[#51A2FF]">Cognitive Load</span>
          </h2>

          <p className="max-w-md text-[#99A1AF] text-xs not-italic font-normal leading-[19.5px]">
            Our AI analyzes your response patterns and time to answer to determine real-time mental pressure. Our
            syllabus adapts while minimizing peak cognitive load.
          </p>

          <div className="flex items-center gap-8">
            <div>
              <div className="text-white text-center text-lg not-italic font-bold leading-7 tracking-[-0.439px]">
                98%
              </div>
              <div className="text-[#6A7282] text-center text-[9px] not-italic font-bold leading-[13.5px] tracking-[1.067px] uppercase">
                ACCURACY
              </div>
            </div>
            <div>
              <div className="text-white text-center text-lg not-italic font-bold leading-7 tracking-[-0.439px]">
                2.4k
              </div>
              <div className="text-[#6A7282] text-center text-[9px] not-italic font-bold leading-[13.5px] tracking-[1.067px] uppercase">
                STUDENTS
              </div>
            </div>
            <button className="bg-[#155DFC] px-8 py-4 transition-transform flex items-center gap-2 shadow-[0_10px_15px_-3px_rgba(28,57,142,0.20),0_4px_6px_-4px_rgba(28,57,142,0.20)] rounded-2xl text-white text-center text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase">
              VIEW ANALYTICS <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 w-full h-50 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-2xl p-5 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
