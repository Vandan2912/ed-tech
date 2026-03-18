import { motion } from "motion/react";
import { Atom, ChartColumn, Clock, Play } from "lucide-react";

export function ContinueLearning() {
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
    <section className="px-6 pt-11 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
          <Clock stroke="currentColor" className="size-6 " />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
          <p className="text-sm text-gray-500">Pick up where you left off</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
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
