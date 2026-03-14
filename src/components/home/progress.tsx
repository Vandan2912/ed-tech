import React from "react";
import { motion } from "motion/react";
import { ChevronRight, Trophy, Award, TrendingUp } from "lucide-react";

export function Progress() {
  return (
    <section className="px-8 py-20 relative overflow-hidden bg-gray-50/50">
      <div className="flex flex-col lg:flex-row gap-16 items-center max-w-7xl mx-auto relative z-10">
        <div className="lg:w-1/3 text-left space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Your Progress</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            You are doing better than <span className="text-gray-900 font-bold">85%</span> of students in your grade.
          </p>
          <a
            href="#"
            className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors gap-1">
            See Learning Path <ChevronRight size={18} />
          </a>
        </div>

        <div className="lg:w-2/3 flex flex-col md:flex-row gap-6">
          {/* Current Level Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-blue-100/50 border border-blue-200 rounded-[2rem] p-8 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <span className="text-blue-900 font-bold text-xs uppercase tracking-widest">CURRENT LEVEL</span>
              <Trophy size={20} className="text-blue-500" />
            </div>
            <div className="text-6xl font-black text-blue-900 mb-6">18</div>
            <div className="space-y-3 mb-6">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[60%] rounded-full"></div>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center text-blue-700 font-bold text-sm hover:text-blue-800 transition-colors gap-1">
              VIEW PROGRESS <ChevronRight size={16} />
            </a>
          </motion.div>

          {/* Certificates Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-purple-100/50 border border-purple-200 rounded-[2rem] p-8 relative overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-8">
              <span className="text-purple-900 font-bold text-xs uppercase tracking-widest">CERTIFICATES</span>
              <Award size={20} className="text-purple-500" />
            </div>
            <div>
              <div className="text-6xl font-black text-purple-900 mb-2">12</div>
              <div className="text-purple-700 font-semibold text-sm">+2 New this month</div>
            </div>
          </motion.div>

          {/* Global Rank Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-orange-100/50 border border-orange-200 rounded-[2rem] p-8 relative overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-8">
              <span className="text-orange-900 font-bold text-xs uppercase tracking-widest">GLOBAL RANK</span>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <div>
              <div className="text-6xl font-black text-orange-900 mb-2">#4</div>
              <div className="text-orange-700 font-semibold text-sm">Top 1% Worldwide</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
