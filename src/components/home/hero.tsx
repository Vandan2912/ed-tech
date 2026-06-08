import { motion } from "motion/react";
import { Trophy, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1C398E] rounded-3xl text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between p-6 md:py-8 md:px-12 shadow-xl shadow-blue-100/50">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>

        <div className="lg:w-1/2 relative z-10 flex flex-col items-start gap-5">
          <div className="w-fit relative bg-white/10 rounded-full outline-1 -outline-offset-1 outline-white/20 flex gap-2 items-center px-3 py-1 backdrop-blur-md border border-white/20 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <div className="justify-start text-white text-[11px]  font-bold uppercase leading-4 tracking-wide">
              Enrollment Open for 2026
            </div>
          </div>

          <h1 className="text-white not-italic text-3xl md:text-4xl lg:text-[42px] font-black leading-[1.1] tracking-tight">
            Unlock Your Potential <br />
            with <span className="text-[#BEDBFF]">AI Intelligence</span>
          </h1>

          <p className="not-italic font-normal tracking-[-0.312px] pr-16 text-sm md:text-base text-blue-50 max-w-md leading-relaxed">
            Join 50,000+ students mastering subjects with personalized paths and
            cognitive pressure analytics.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <button className="bg-white hover:bg-gray-50 px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2 text-[#1C398E] text-center text-sm not-italic font-bold leading-5 tracking-[-0.15px]">
              Enroll Now
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className=" hidden md:flex lg:w-70 bg-blue-800/30 backdrop-blur-md border border-blue-700/50 rounded-3xl p-5 relative z-10 mt-12 lg:mt-0 shadow-2xl hover:bg-white/10 transition-colors flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-[#51A2FF33] rounded-[10px] w-8 h-8 flex justify-center items-center">
                <Trophy size={16} className="text-[#BEDBFF]" />
              </div>
              <div className="flex flex-col">
                <div className="text-[#BEDBFF] text-[9px] not-italic font-bold leading-[13.5px] tracking-[1.067px] uppercase">
                  Level
                </div>
                <div className="text-white text-sm not-italic font-bold leading-5 tracking-[-0.15px]">
                  18
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#BEDBFF] text-right text-[9px] not-italic font-bold leading-[13.5px] tracking-[1.067px] uppercase">
                Rank
              </span>
              <span className="text-[#DAB2FF] text-right text-sm not-italic font-bold leading-5 tracking-[-0.15px]">
                #42
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-1 bg-[#FFFFFF1A] rounded-full overflow-hidden">
              <div className="h-full bg-[#8EC5FF] w-2/3 rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-[rgba(219,234,254,0.60)] text-[9px] not-italic font-bold leading-[13.5px] tracking-[0.167px] uppercase">
                650 XP
              </span>
              <span className="text-[rgba(219,234,254,0.60)] text-[9px] not-italic font-bold leading-[13.5px] tracking-[0.167px] uppercase">
                Next: Lvl 19
              </span>
            </div>
          </div>

          <button className="w-full flex justify-center items-start gap-[9.195px] self-stretch border p-2 rounded-[10px] border-solid border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.80)] text-[11px] not-italic font-bold leading-[16.5px] tracking-[0.064px] bg-[#FFFFFF0D]">
            Continue Learning <ChevronRight size={18} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
