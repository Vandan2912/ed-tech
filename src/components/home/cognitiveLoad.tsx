import { motion } from "motion/react";
import { Activity, ChevronRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";

const data = [
  { time: "Day 1", load: 30 },
  { time: "Day 2", load: 35 },
  { time: "Day 3", load: 25 },
  { time: "Day 4", load: 45 },
  { time: "Day 5", load: 40 },
  { time: "Day 6", load: 50 },
  { time: "Day 7", load: 45 },
  { time: "Day 8", load: 60 },
  { time: "Day 9", load: 55 },
  { time: "Day 10", load: 70 },
  { time: "Day 11", load: 65 },
  { time: "Day 12", load: 80 },
  { time: "Day 13", load: 75 },
  { time: "Day 14", load: 90 },
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
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="lg:w-1/2 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 backdrop-blur-sm border border-blue-800 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300 tracking-wider uppercase">
            <Activity size={16} className="text-blue-400" />
            <span>COGNITIVE TRACKING</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            Understand Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Cognitive Load
            </span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
            Our AI analyzes your response patterns and time to answer to determine real-time mental pressure. Our
            syllabus adapts while minimizing peak cognitive load.
          </p>

          <div className="flex items-center gap-12 pt-4">
            <div>
              <div className="text-3xl font-black text-white">96%</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">ACCURACY</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">2.4k</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">STUDENTS</div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2 ml-auto">
              VIEW ANALYTICS <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 w-full h-[300px] bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#f3f4f6" }}
                itemStyle={{ color: "#60a5fa" }}
              />
              <Line
                type="monotone"
                dataKey="load"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 8, fill: "#3b82f6", stroke: "#1e3a8a", strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
