import { motion } from "motion/react";
import { Flame, Calculator, Zap, FlaskConical, Dna, BookOpen, Globe2 } from "lucide-react";
import user from "@/assets/user.svg";

export function ConsistencyQuest() {
  const subjects = [
    { name: "Maths", points: "+50 Pts", icon: <Calculator size={20} className="text-blue-600" />, color: "bg-blue-50" },
    { name: "Physics", points: "+30 Pts", icon: <Zap size={20} className="text-indigo-600" />, color: "bg-indigo-50" },
    {
      name: "Chemistry",
      points: "+45 Pts",
      icon: <FlaskConical size={20} className="text-emerald-600" />,
      color: "bg-emerald-50",
    },
    { name: "Biology", points: "+20 Pts", icon: <Dna size={20} className="text-rose-600" />, color: "bg-rose-50" },
    {
      name: "History",
      points: "+15 Pts",
      icon: <BookOpen size={20} className="text-orange-600" />,
      color: "bg-orange-50",
    },
    { name: "Geography", points: "+25 Pts", icon: <Globe2 size={20} className="text-cyan-600" />, color: "bg-cyan-50" },
  ];

  return (
    <section className="px-8 py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] p-10 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col lg:flex-row gap-12 items-center justify-between">
        <div className="lg:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 text-xs font-bold text-orange-600 tracking-wider uppercase">
            <Flame size={16} fill="currentColor" />
            <span>DAILY QUEST</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            The 30-Day{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Consistency
            </span>{" "}
            Quest
          </h2>

          <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
            Build a learning habit that lasts. Maintain your streak for 30 days to unlock the{" "}
            <span className="font-bold text-gray-900">Elite Pioneer Badge</span> and{" "}
            <span className="font-bold text-orange-600">5,000 XP</span>.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <button className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
              Join Challenge
            </button>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  src={user}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <img
                  src={user}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <img
                  src={user}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">+2.3K ACTIVE LEARNERS</span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {subjects.map((sub, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 border border-gray-100 transition-all hover:shadow-md cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl ${sub.color} flex items-center justify-center`}>{sub.icon}</div>
                <div>
                  <div className="font-bold text-gray-900">{sub.name}</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{sub.points}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
