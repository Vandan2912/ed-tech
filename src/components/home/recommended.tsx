import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useAppSelector } from "@/store/store";
import { useNavigate } from "react-router-dom";

export function Recommended() {
  const subjects = useAppSelector((state) => state.course.subjects);
  const navigate = useNavigate();

  if (subjects.length === 0) return null;

  return (
    <section className="px-6 pb-5 md:pb-16">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-[30px] font-bold text-[#101828] leading-[36px] tracking-[0.3955px]">
            Recommended for You
          </h2>
          <p className="text-[16px] text-[#6a7282] leading-6 tracking-[-0.3125px]">
            Based on your curriculum
          </p>
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="text-[#155dfc] text-[16px] font-bold leading-6 tracking-[-0.3125px] hover:opacity-70 transition-opacity shrink-0">
          View All Subjects
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.slice(0, 6).map((subject, idx) => (
          <motion.article
            key={subject.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, type: "spring", stiffness: 120 }}
            className="bg-white border border-[#e5e7eb] rounded-[32px] flex flex-col gap-[15px] pt-[33px] pl-[33px] pr-[33px] pb-[20px]">
            {/* Card body */}
            <div className="flex flex-col gap-[15px] flex-1">
              {/* Module badge */}
              <div className="flex items-start">
                <span className="bg-[rgba(34,94,212,0.12)] border border-[#e5e7eb] rounded-full px-3 h-[30.5px] flex items-center">
                  <span className="text-[#11306d] text-[11px] font-black uppercase tracking-[1.1645px] leading-[16.5px]">
                    {subject.topics?.length ?? 0} Modules
                  </span>
                </span>
              </div>

              {/* Subject name + description */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[#101828] text-[18px] font-bold leading-6 tracking-[-0.3125px]">
                  {subject.name}
                </h3>
                <p className="text-[#364153] text-[14px] font-normal leading-[22.75px] tracking-[-0.1504px]">
                  Master the fundamentals of {subject.name.toLowerCase()} with
                  our AI-guided structured modules.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#f3f4f6] pt-[14px]">
              <button
                onClick={() => navigate(`/courses/${subject.id}`)}
                className="w-full h-[35px] bg-[#155dfc] rounded-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <span className="text-white text-[13px] font-extrabold capitalize leading-[16.5px]">
                  Start Learning
                </span>
                <ChevronRight size={16} className="text-white" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
