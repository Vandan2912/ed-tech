import { motion } from "motion/react";
import { ChevronRight, Trophy, Award, Medal } from "lucide-react";
import type { HomeProgressSummary } from "@/api/home";
import { Link } from "react-router-dom";

interface Props {
  summary?: HomeProgressSummary;
}

export function Progress({ summary }: Props) {
  return (
    <section className="px-6 pb-5 md:pb-16 relative overflow-hidden bg-gray-50/50">
      <div className="lg:flex-row gap-16 max-w-7xl mx-auto relative z-10 flex w-full flex-col items-start border border-blue-50 rounded-[40px] border-solid bg-white p-8 md:p-12 shadow-2xl shadow-blue-50/50 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3
              id="progress-snapshot-heading"
              className="text-xl font-bold text-gray-900">
              Your Progress
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              You are doing better than 85% of students in your grade.
            </p>
            <Link
              to="/progress"
              className="text-blue-900 font-bold text-sm flex items-center gap-1 focus:underline">
              See Learning Path{" "}
              <ChevronRight size={16} className="text-blue-900" />
            </Link>
          </div>

          {/* Courses Completed Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-blue-100 p-6 rounded-3xl flex flex-col gap-4">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#1C398E] text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
                COURSES COMPLETED
              </span>
              <Trophy size={16} className="text-blue-500" />
            </div>
            <div className="mb-3 text-[#1C398E] text-3xl not-italic font-black leading-9 tracking-[0.396px]">
              {summary?.courses_completed ?? "—"}
            </div>
            <a
              href="/progress"
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
            className="bg-purple-100 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#59168B] text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
                CERTIFICATES
              </span>
              <Award size={16} className="text-purple-500" />
            </div>
            <div>
              <div className="text-[#59168B] text-3xl not-italic font-black leading-9 tracking-[0.396px] mb-2">
                {summary?.certificates_earned ?? "—"}
              </div>
            </div>
            <a
              href="/certificates"
              className="inline-flex items-center gap-1 text-[#59168B] text-center text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
              VIEW certificates <ChevronRight size={14} />
            </a>
          </motion.div>

          {/* Global Rank Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-orange-100 rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#7E2A0C] text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
                GLOBAL RANK
              </span>
              <Medal size={16} className="text-orange-500" />
            </div>
            <div>
              <div className="text-[#7E2A0C] text-3xl not-italic font-black leading-9 tracking-[0.396px] mb-2">
                {summary?.global_rank != null ? `#${summary.global_rank}` : "—"}
              </div>
            </div>
            <a
              href="/ranks"
              className="inline-flex items-center gap-1 text-[#7E2A0C] text-center text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
              VIEW RANK <ChevronRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
