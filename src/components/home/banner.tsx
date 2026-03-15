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
        className="bg-[#111827] rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-[35%] w-64 h-64 opacity-40 bg-[#2B7FFF] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-[55%] w-64 h-64 opacity-40 bg-[#AD46FF] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-6 lg:px-10 lg:py-6">
          <div className="flex items-center gap-8 flex-1">
            <div className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl bg-gray-800 rotate-3 border-2 border-[#FFFFFF33]">
              <img src={imgBannerGraphic} alt="Student learning" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mb-1 py-0 px-4 bg-[#615FFF1A] rounded-full border border-[#615FFF33]">
                <Target size={12} />
                NEXT-GEN EDUCATION
              </div>

              <h2 className="text-[#FFFFFF] text-2xl not-italic font-black leading-7.5 tracking-[0.07px]">
                A Smarter Solution for the <span className="text-[#51A2FF]">Next Generation.</span>
              </h2>

              <p className="text-[#99A1AF] text-sm not-italic font-normal leading-[22.75px] tracking-[-0.15px]">
                Adaptive AI learning paths designed to maximize retention while minimizing cognitive load. Experience
                the breakthrough in modern education today.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button className="bg-white text-[#101828] text-center text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase flex justify-center items-center flex-1 shadow-[0_10px_15px_-3px_rgba(255,255,255,0.05),0_4px_6px_-4px_rgba(255,255,255,0.05)] px-8 py-3.5 rounded-[14px]">
              ENROLL FREE
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
