import { motion } from "motion/react";
import { Calculator, Zap, FlaskConical, ChevronRight } from "lucide-react";
import user from "@/assets/user.svg";

export function Recommended() {
  const recommendations = [
    {
      title: "Maths",
      desc: "Master the fundamentals of maths with our AI-guided structured modules.",
      modules: 2,
      icon: <Calculator size={24} className="text-blue-600" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Physics",
      desc: "Master the fundamentals of physics with our AI-guided structured modules.",
      modules: 2,
      icon: <Zap size={24} className="text-indigo-600" />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Chemistry",
      desc: "Master the fundamentals of chemistry with our AI-guided structured modules.",
      modules: 2,
      icon: <FlaskConical size={24} className="text-emerald-600" />,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section className="px-8 py-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Recommended for You</h2>
          <p className="text-gray-500 font-medium text-lg">Based on your 10th grade curriculum</p>
        </div>
        <a
          href="#"
          className="hidden sm:inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors gap-1">
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
            className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl ${rec.color} flex items-center justify-center`}>{rec.icon}</div>
                <div className="bg-gray-50 px-3 py-1 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest border border-gray-100">
                  {rec.modules} MODULES
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{rec.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-10">{rec.desc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto">
              <div className="flex -space-x-3">
                <img
                  src={user}
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <img
                  src={user}
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <img
                  src={user}
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                />
              </div>

              <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1 transition-colors">
                START LEARNING <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
