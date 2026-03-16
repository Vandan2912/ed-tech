import { Brain, Flame, User, Users, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between py-4 px-8 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <div className="bg-[#1C398E] p-1.5 rounded-lg text-white">
          <Brain size={20} />
        </div>
        <div className="text-[#101828] text-center text-base not-italic font-black leading-6 tracking-[-0.712px] flex items-center gap-1.5">
          SmartLearn
          <div className="bg-[#DBEAFE] px-1.5 py-0.5 text-[#1447E6] text-center text-[9px] not-italic font-black leading-[13.5px] tracking-[1.067px] uppercase rounded-[8px]">
            AI
          </div>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-0.5 p-1 text-sm text-[#6A7282] bg-[#F3F4F6E5] rounded-full border border-[#E5E7EBCC] text-[11px] not-italic font-black leading-[16.5px] tracking-[1.164px] uppercase">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex justify-center items-center px-3.75 py-1.5 rounded-full ${
              isActive
                ? "text-[#1C398E] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10 text-center "
                : "hover:text-[#1C398E]"
            }`
          }>
          HOME
        </NavLink>
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `flex justify-center items-center px-3.75 py-1.5 rounded-full ${
              isActive
                ? "text-[#1C398E] font-semibold bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
                : "hover:text-[#1C398E]"
            }`
          }>
          COURSES
        </NavLink>
        <NavLink
          to="/ranks"
          className={({ isActive }) =>
            `flex justify-center items-center px-3.75 py-1.5 rounded-full ${
              isActive
                ? "text-[#1C398E] font-semibold bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
                : "hover:text-[#1C398E]"
            }`
          }>
          RANKS
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `flex justify-center items-center px-3.75 py-1.5 rounded-full ${
              isActive
                ? "text-[#1C398E] font-semibold bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
                : "hover:text-[#1C398E]"
            }`
          }>
          STATS
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `flex justify-center items-center px-3.75 py-1.5 rounded-full ${
              isActive
                ? "text-[#1C398E] font-semibold bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
                : "hover:text-[#1C398E]"
            }`
          }>
          PROGRESS
        </NavLink>
        <NavLink
          to="/study"
          className={({ isActive }) =>
            `flex justify-center items-center px-3.75 py-1.5 rounded-full ${
              isActive
                ? "text-[#1C398E] font-semibold bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
                : "hover:text-[#1C398E]"
            }`
          }>
          <Users size={16} className="me-1.75" /> STUDY
        </NavLink>
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full text-sm group text-[#F54900] text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px] border border-[#FFD6A8CC]">
            <Flame size={16} className="group-hover:scale-110" /> 7
          </div>
          <div className="flex items-center gap-1 bg-blue-50 text-[#155DFC] px-3 py-1.5 rounded-full text-sm border border-[#A9C8FFCC] group text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px]">
            <Zap size={16} fill="#155DFC" className="group-hover:scale-110" /> 4
          </div>
        </div>

        <div className="w-9 h-9 flex-col shrink-0 shadow-[0_0_0_2px_#E5E7EB,0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] p-0.5 rounded-[16777200px] border-2 border-solid border-white flex justify-center items-center">
          {/* <img
            style={{ alignSelf: "stretch", height: 32, position: "relative" }}
            src="https://placehold.co/32x32"
            className="h-8 shrink-0 self-stretch"
          /> */}
          <User size={20} className="text-black" />
        </div>
      </div>
    </header>
  );
}
