import { motion } from "motion/react";
import imgBannerGraphic from "@/assets/home-banner.png";

export function Banner() {
  return (
    <section className="px-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#111827] rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-6 lg:px-10 lg:py-6">
          <div className="flex items-center gap-8 flex-1">
            <div className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl bg-gray-800">
              <img src={imgBannerGraphic} alt="Student learning" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                NEXT-GEN EDUCATION
              </div>

              <h2 className="text-2xl font-bold text-white leading-snug">
                A Smarter Solution for the <span className="text-blue-400">Next Generation.</span>
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed">
                Adaptive AI learning paths designed to maximize retention while minimizing cognitive load. Experience
                the breakthrough in modern education today.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button className="bg-white hover:bg-gray-100 text-[#111827] font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 whitespace-nowrap">
              ENROLL FREE
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
