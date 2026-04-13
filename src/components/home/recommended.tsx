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
    <section className="px-6 pb-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Recommended for You
          </h2>
          <p className="text-gray-500">Based on your 10th grade curriculum</p>
        </div>
        <button className="text-blue-600 font-bold hover:underline">
          View All Subjects
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            className="bg-white rounded-[2rem] flex flex-col justify-between h-full gap-8 group  border border-gray-200 p-8 transition-all hover:shadow-xl hover:shadow-gray-200/20 focus-within:ring-4 focus-within:ring-blue-100"
          >
            <div className="flex justify-between items-start">
              <div
                className={`w-12 h-12 rounded-2xl ${rec.color} flex items-center justify-center`}
              >
                {rec.icon}
              </div>
              <div className="bg-gray-100 text-gray-900 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-200">
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
