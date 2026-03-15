import React from "react";
import { motion } from "motion/react";
import { Play, Activity, Beaker } from "lucide-react";

export function ResumeLearning() {
  const courses = [
    {
      title: "Trigonometry",
      subject: "Maths",
      progress: 80,
      time: "2 HOURS AGO",
      icon: <Activity size={24} className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Laws of Motion",
      subject: "Physics",
      progress: 76,
      time: "YESTERDAY",
      icon: <Beaker size={24} className="text-indigo-500" />,
      color: "bg-indigo-100",
    },
  ];

  return (
    <section className="px-8 py-10 relative">
      <div className="flex justify-between items-center bg-[#1E3A8A] text-white px-8 py-4 rounded-full mb-10 shadow-lg relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-full">
            <Play size={20} className="text-white fill-white" />
          </div>
          <div>
            <div className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              PICK UP WHERE YOU LEFT OFF
            </div>
            <div className="text-lg font-bold">
              Trigonometry <span className="text-blue-300 font-normal">Maths</span>
            </div>
          </div>
        </div>
        <button className="bg-white text-blue-900 px-6 py-2.5 rounded-full font-bold text-sm shadow flex items-center gap-2 transition-transform hover:-translate-y-0.5">
          <Play size={16} className="fill-blue-900" /> RESUME
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-0 -mt-16 pt-16">
        {courses.map((course, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div className={`${course.color} p-4 rounded-2xl`}>{course.icon}</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">{course.time}</div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <div className="text-gray-500 font-medium mb-8">{course.subject}</div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-500">Progress</span>
                <span className="text-blue-600">{course.progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>

            <button className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Play size={18} className="fill-white" /> Resume Lesson
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
