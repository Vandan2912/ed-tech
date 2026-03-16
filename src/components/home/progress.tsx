import { motion } from "motion/react";
import { ChevronRight, Trophy, Award, Medal } from "lucide-react";

export function Progress() {
  return (
    <section className="px-8 pb-16 relative overflow-hidden bg-gray-50/50">
      <div className="lg:flex-row gap-16 max-w-7xl mx-auto relative z-10 flex w-full flex-col items-start border border-blue-50 shadow-[0_25px_50px_-12px_rgba(239,246,255,0.50)] p-12.25 rounded-[40px] border-solid">
        <div className="lg:w-1/3 text-left space-y-6">
          <h2 className="md:text-xl text-[#101828] text-lg not-italic font-bold leading-7 tracking-[-0.449px]">
            Your Progress
          </h2>
          <p className="text-[#364153] text-sm not-italic font-normal leading-[22.75px] tracking-[-0.15px]">
            You are doing better than <span className="text-gray-900 font-bold">85%</span> of students in your grade.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-[#1C398E] text-center text-sm not-italic font-bold leading-5 tracking-[-0.15px]">
            See Learning Path <ChevronRight size={18} />
          </a>
        </div>

        <div className="lg:w-2/3 flex flex-col md:flex-row gap-6">
          {/* Current Level Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-blue-100/50 rounded-[2rem] p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#1C398E] text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
                CURRENT LEVEL
              </span>
              <Trophy size={16} className="text-blue-500" />
            </div>
            <div className="mb-3 text-[#1C398E] text-3xl not-italic font-black leading-9 tracking-[0.396px]">18</div>
            <div className="space-y-3 mb-3">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[60%] rounded-full"></div>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-[#1C398E] text-center text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
              VIEW PROGRESS <ChevronRight size={14} />
            </a>
          </motion.div>

          {/* Certificates Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-purple-100/50 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-start">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#59168B] text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
                CERTIFICATES
              </span>
              <Award size={16} className="text-purple-500" />
            </div>
            <div>
              <div className="text-[#59168B] text-3xl not-italic font-black leading-9 tracking-[0.396px] mb-2">12</div>
              <div className="text-[#3C0366] text-xs not-italic font-bold leading-4">+2 New this month</div>
            </div>
          </motion.div>

          {/* Global Rank Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-orange-100/50 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-start">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#7E2A0C] text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
                GLOBAL RANK
              </span>
              <Medal size={16} className="text-orange-500" />
            </div>
            <div>
              <div className="text-[#7E2A0C] text-3xl not-italic font-black leading-9 tracking-[0.396px] mb-2">#4</div>
              <div className="text-[#441306] text-xs not-italic font-bold leading-4">Top 1% Worldwide</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
