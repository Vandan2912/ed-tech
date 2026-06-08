import { motion } from "motion/react";
import {
  Zap,
  FlaskConical,
  Dna,
  ChevronRight,
  ChartColumn,
  Atom,
  Layers,
  Globe,
  Flame,
} from "lucide-react";

export function ConsistencyQuest() {
  const subjects = [
    {
      name: "Maths",
      subheading: "Mastery",
      isStreak: false,
      icon: <ChartColumn size={20} className="text-white" />,
      color: "bg-[#155DFC]",
    },
    {
      name: "Physics",
      subheading: null,
      isStreak: true,
      streak: "12D",
      icon: <Atom size={20} className="text-white" />,
      color: "bg-[#4F39F6]",
    },
    {
      name: "Chemistry",
      subheading: null,
      isStreak: true,
      streak: "28D",
      icon: <FlaskConical size={20} className="text-white" />,
      color: "bg-[#009966]",
    },
    {
      name: "Biology",
      subheading: "Mastery",
      isStreak: false,
      icon: <Dna size={20} className="text-white" />,
      color: "bg-[#EC003F]",
    },
    {
      name: "History",
      subheading: "Mastery",
      isStreak: false,
      icon: <Layers size={20} className="text-white" />,
      color: "bg-[#F54900]",
    },
    {
      name: "Geography",
      subheading: "Mastery",
      isStreak: false,
      icon: <Globe size={20} className="text-white" />,
      color: "bg-[#009689]",
    },
  ];

  return (
    <section className="px-6 py-5 md:py-16 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] flex flex-col lg:flex-row gap-12 items-center justify-between p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="space-y-6 flex-1">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 text-xs  text-[#F54900] text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase">
            <Zap size={12} fill="currentColor" />
            <span>Mastery Quest</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            The 30-Day <span className="text-orange-500">Consistency</span>{" "}
            Quest
          </h2>

          <p className="max-w-md text-[#6A7282] text-sm not-italic font-normal leading-[22.75px] tracking-[-0.15px]">
            Build a learning habit that lasts. Maintain your streak for 30 days
            to unlock the{" "}
            <span className="font-bold text-[#101828]">
              Elite Pioneer Badge
            </span>{" "}
            and <span className="font-bold text-[#F54900]">5,000 XP</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
              Join Challenge <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="shrink-0 md:min-w-[40%] md:w-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {subjects.map((sub, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-[#F9FAFB80] rounded-2xl p-4.25 flex flex-col items-center justify-center text-center gap-4 border border-[#00000000] transition-all hover:shadow-md cursor-pointer">
                <div
                  className={`shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] flex w-9 h-9 justify-center items-center rounded-[14px] ${sub.color}`}>
                  {sub.icon}
                </div>
                <div>
                  <div className="text-[#101828] text-center text-xs not-italic font-bold leading-4">
                    {sub.name}
                  </div>
                  {sub.isStreak ? (
                    <div className="flex items-center justify-center gap-1 text-[#FF6900] text-center text-[8px] not-italic font-black leading-3 tracking-[1.006px] uppercase">
                      <Flame size={8} className="fill-[#FF6900]" /> {sub.streak}{" "}
                      STREAK
                    </div>
                  ) : (
                    <div className="text-[#99A1AF] text-center text-[8px] not-italic font-bold leading-3 tracking-[1.006px] uppercase">
                      {sub.subheading}
                    </div>
                  )}
                </div>
                <button className="text-center text-blue-600 bg-[#EFF6FF] text-[8px] font-black uppercase leading-3 tracking-wide inline-flex justify-center items-center border pl-[16.938px] pr-[16.063px] pt-[9.5px] pb-[8.5px] rounded-[14px] border-solid border-[rgba(219,234,254,0.50)]">
                  Enroll Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
