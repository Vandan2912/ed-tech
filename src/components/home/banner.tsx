import { motion } from "motion/react";
import imgBannerGraphic from "@/assets/home-banner.png";
import { Target } from "lucide-react";

export function Banner() {
  return (
    <section className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-linear-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-[32px] border border-white/10 shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-6 lg:px-10 lg:py-6">
          <div className="flex items-center gap-8 flex-1">
            <div className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl bg-gray-800 rotate-3 border-2 border-[#FFFFFF33] hidden lg:block">
              <img src={imgBannerGraphic} alt="Student learning" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 max-w-xl flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-0 bg-indigo-500/10 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3 border border-indigo-500/20">
                <Target size={12} />
                NEXT-GEN EDUCATION
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">
                A Smarter Solution for the <span className="text-[#51A2FF]">Next Generation.</span>
              </h2>

              <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                Adaptive AI learning paths designed to maximize retention while minimizing cognitive load. Experience
                the breakthrough in modern education today.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hidden xl:flex">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-gray-800 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1729824186570-4d4aede00043?auto=format&amp;fit=crop&amp;w=32&amp;h=32"
                    alt="user"
                  />
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-gray-800 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1631905131477-eefc1360588a?auto=format&amp;fit=crop&amp;w=32&amp;h=32"
                    alt="user"
                  />
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-gray-800 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1676253134904-d28c52a5d031?auto=format&amp;fit=crop&amp;w=32&amp;h=32"
                    alt="user"
                  />
                </div>
              </div>
              <div className="text-[10px] font-bold text-gray-400 leading-none">
                <p className="text-white">50k+</p>
                <p>Students</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-400 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5">
              Enroll Free
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
