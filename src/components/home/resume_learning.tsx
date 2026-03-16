import { motion } from "motion/react";
import { Atom, ChartColumn, Clock, Play } from "lucide-react";

export function ResumeLearning() {
  const courses = [
    {
      title: "Trigonometry",
      subject: "Maths",
      progress: 80,
      time: "2 HOURS AGO",
      icon: <ChartColumn size={24} className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Laws of Motion",
      subject: "Physics",
      progress: 76,
      time: "YESTERDAY",
      icon: <Atom size={24} className="text-indigo-500" />,
      color: "bg-indigo-100",
    },
  ];

  return (
    <section className="p-6 pt-11 relative">
      <div className="flex justify-between items-center bg-[#1E3A8A] text-white px-5 py-4 rounded-[16px] mb-4 relative z-10 shadow-[0_20px_25px_-5px_rgba(28,57,142,0.20),0_8px_10px_-6px_rgba(28,57,142,0.20)]">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-[14px]">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <div className="text-[#8EC5FF] text-[9px] not-italic font-black leading-[13.5px] tracking-[1.067px] uppercase">
              PICK UP WHERE YOU LEFT OFF
            </div>
            <div className="text-white text-sm not-italic font-bold leading-5 tracking-[-0.15px]">
              Trigonometry <span className="text-[#8EC5FF] text-xs not-italic font-bold leading-4">Maths</span>
            </div>
          </div>
        </div>
        <button className="bg-white px-5 py-2.5 rounded-[14px] shadow flex items-center gap-2 transition-transform hover:-translate-y-0.5 text-[#1C398E] text-center text-xs not-italic font-black leading-4 tracking-[1.2px] uppercase">
          <Play size={16} className="fill-blue-900" /> RESUME
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-0 -mt-16 pt-16">
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
              <div className="text-[#99A1AF] text-[10px] not-italic font-bold leading-3.75 tracking-[1.117px] uppercase">
                {course.time}
              </div>
            </div>

            <h3 className="text-[#101828] text-xl not-italic font-bold leading-7 tracking-[-0.449px] mb-2">
              {course.title}
            </h3>
            <div className="text-[#6A7282] text-sm not-italic font-normal leading-5 tracking-[-0.15px] mb-8">
              {course.subject}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[#99A1AF] text-xs not-italic font-bold leading-4">Progress</span>
                <span className="text-blue-600">{course.progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>

            <button className="w-full bg-[#0F172A] hover:bg-[#1E293B] py-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-white text-center text-base not-italic font-bold leading-6 tracking-[-0.312px]">
              <Play size={18} className="fill-white" /> Resume Lesson
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
