import React from "react";
import { motion } from "motion/react";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";
import user from "@/assets/user.svg";

export function Hero() {
  return (
    <section className="px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-900 rounded-3xl p-12 lg:p-16 text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="lg:w-1/2 relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-800/50 backdrop-blur-sm border border-blue-700 rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 uppercase tracking-wider">
            <Sparkles size={16} className="text-blue-300" />
            <span>Over 1,000,000+ sessions resolved</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Unlock Your Potential <br />
            <span className="text-blue-200">with AI Intelligence</span>
          </h1>

          <p className="text-blue-100 text-lg leading-relaxed max-w-lg">
            Join 10,000+ students mastering subjects with personalized paths and cognitive pressure analytics.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <button className="bg-white text-blue-900 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2">
              Enroll Now
            </button>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src={user} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-blue-900 object-cover" />
                <img src={user} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-blue-900 object-cover" />
                <img src={user} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-blue-900 object-cover" />
              </div>
              <span className="text-sm font-semibold text-blue-200">+12K JOINED TODAY</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-[400px] bg-blue-800/30 backdrop-blur-md border border-blue-700/50 rounded-3xl p-6 relative z-10 mt-12 lg:mt-0 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Level 18</div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">540</span>
                <span className="text-blue-300 font-medium mb-1">XP</span>
              </div>
            </div>
            <div className="bg-blue-600/50 p-3 rounded-2xl">
              <Trophy size={24} className="text-yellow-400" />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-blue-100">Step 4/6</span>
              <span className="text-blue-200">NEXT: UNIT 18</span>
            </div>
            <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 w-2/3 rounded-full"></div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
            Continue Learning <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
