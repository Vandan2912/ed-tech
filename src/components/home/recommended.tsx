import { motion } from "motion/react";
import { ChevronRight, BookOpen } from "lucide-react";
import { useAppSelector } from "@/store/store";
import { useNavigate } from "react-router-dom";

const CARD_COLORS = [
  "bg-[#DBEAFE]",
  "bg-[#E0E7FF]",
  "bg-[#D0FAE5]",
  "bg-[#FEF3C7]",
  "bg-[#FCE7F3]",
  "bg-[#EDE9FE]",
];

const ICON_COLORS = [
  "text-[#1C398E]",
  "text-[#312C85]",
  "text-[#004F3B]",
  "text-[#92400E]",
  "text-[#9D174D]",
  "text-[#5B21B6]",
];

export function Recommended() {
  const subjects = useAppSelector((state) => state.course.subjects);
  const navigate = useNavigate();

  if (subjects.length === 0) return null;

  return (
    <section className="px-6 pb-5 md:pb-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Recommended for You
          </h2>
          <p className="text-gray-500">Based on your curriculum</p>
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="text-blue-600 font-bold hover:underline">
          View All Subjects
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.slice(0, 6).map((subject, idx) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            className="bg-white rounded-[2rem] flex flex-col justify-between h-full gap-8 group border border-gray-200 p-8 transition-all hover:shadow-xl hover:shadow-gray-200/20 focus-within:ring-4 focus-within:ring-blue-100">
            <div className="flex justify-between items-start">
              <div
                className={`w-12 h-12 rounded-2xl ${CARD_COLORS[idx % CARD_COLORS.length]} flex items-center justify-center`}>
                <BookOpen
                  size={24}
                  className={ICON_COLORS[idx % ICON_COLORS.length]}
                />
              </div>
              <div className="bg-gray-100 text-gray-900 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-200">
                {subject.topics?.length ?? 0} TOPICS
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-[#101828] text-base not-italic font-medium leading-6 tracking-[-0.312px]">
                {subject.name}
              </h3>
              <p className="text-[#364153] text-sm not-italic font-normal leading-[22.75px] tracking-[-0.15px]">
                Master the fundamentals of {subject.name.toLowerCase()} with our
                AI-guided structured modules.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-auto">
              <button
                onClick={() => navigate(`/courses/${subject.id}`)}
                className="bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm flex items-center gap-1 transition-colors text-[#1C398E] text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[1.164px] uppercase">
                START LEARNING <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
