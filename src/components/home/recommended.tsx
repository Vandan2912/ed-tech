import { motion } from "motion/react";
import { FlaskConical, ChevronRight, ChartColumn, Atom } from "lucide-react";
import user from "@/assets/user.svg";

export function Recommended() {
  const recommendations = [
    {
      title: "Maths",
      desc: "Master the fundamentals of maths with our AI-guided structured modules.",
      modules: 2,
      icon: <ChartColumn size={24} className="text-[#1C398E]" />,
      color: "bg-[#DBEAFE]",
    },
    {
      title: "Physics",
      desc: "Master the fundamentals of physics with our AI-guided structured modules.",
      modules: 2,
      icon: <Atom size={24} className="text-[#312C85]" />,
      color: "bg-[#E0E7FF]",
    },
    {
      title: "Chemistry",
      desc: "Master the fundamentals of chemistry with our AI-guided structured modules.",
      modules: 2,
      icon: <FlaskConical size={24} className="text-[#004F3B]" />,
      color: "bg-[#D0FAE5]",
    },
  ];

  return (
    <section className="px-8 pb-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="mb-2 text-[#101828] text-3xl not-italic font-bold leading-9 tracking-[0.396px]">
            Recommended for You
          </h2>
          <p className="text-[#6A7282] text-base not-italic font-normal leading-6 tracking-[-0.312px]">
            Based on your 10th grade curriculum
          </p>
        </div>
        <a
          href="#"
          className="hidden sm:inline-flex items-center gap-1 text-[#155DFC] text-center text-base not-italic font-bold leading-6 tracking-[-0.312px]">
          View All Subjects
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between h-full gap-8">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-2xl ${rec.color} flex items-center justify-center`}>{rec.icon}</div>
              <div className="bg-gray-50 px-3 py-1 rounded-full text-xs border border-gray-100 text-[#101828] text-[11px] not-italic font-black leading-[16.5px] tracking-[1.164px] uppercase">
                {rec.modules} MODULES
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-[#101828] text-base not-italic font-medium leading-6 tracking-[-0.312px]">
                {rec.title}
              </h3>
              <p className="text-[#364153] text-sm not-italic font-normal leading-[22.75px] tracking-[-0.15px]">
                {rec.desc}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-auto">
              <div className="flex -space-x-3">
                <img
                  src={user}
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white bg-white object-cover shadow-sm z-1"
                />
                <img
                  src={user}
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white bg-white object-cover shadow-sm z-2"
                />
                <img
                  src={user}
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white bg-white object-cover shadow-sm z-3"
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-white object-cover shadow-sm text-[#1C398E] text-[10px] not-italic font-bold leading-3.75 tracking-[0.117px] z-4 flex justify-center items-center">
                  +2K
                </div>
              </div>

              <button className="bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm flex items-center gap-1 transition-colors text-[#1C398E] text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[1.164px] uppercase">
                START LEARNING <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
