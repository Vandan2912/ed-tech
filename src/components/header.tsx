import { Award, Bell, Brain, Flame, LogOut, Settings, User, Users, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-8 ">
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full text-sm group text-[#F54900] text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px] border border-[#FFD6A8CC]">
            <Flame size={16} className="group-hover:scale-110" /> 7
          </div>
          <div className="flex items-center gap-1 bg-blue-50 text-[#155DFC] px-3 py-1.5 rounded-full text-sm border border-[#A9C8FFCC] group text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px]">
            <Zap size={16} fill="#155DFC" className="group-hover:scale-110" /> 4
          </div>

          <div className="relative w-9 h-9 flex-col shrink-0 p-0.5 rounded-full bg-[#F3F4F6] flex justify-center items-center ">
            <Bell size={16} className="text-black" />
            <div className="absolute -top-1 -right-1 bg-[#FB2C36] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] flex w-4 h-4 justify-center items-center rounded-full text-white text-center text-[8px] not-italic font-black leading-3 tracking-[0.206px]">
              3
            </div>
          </div>
          <div className="w-px h-5 bg-[#E5E7EB] rounded-full"></div>

          <Popover>
            <PopoverTrigger asChild>
              <div className="w-8 h-8 flex-col shrink-0 shadow-[0_0_0_2px_#E5E7EB,0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] rounded-full border-2 border-solid border-white flex justify-center items-center">
                {user?.profile_picture ? (
                  <img src={user?.profile_picture} className="rounded-full w-8 h-8" />
                ) : (
                  <User size={16} className="text-black" />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-60 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 px-0 overflow-hidden z-50">
              <div className="px-5 py-3 border-b border-gray-50 mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active {user?.role}</p>
                  <p className="font-bold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
              </div>
              <div className="px-2 space-y-0.5">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all mb-1 group/upgrade">
                  <Zap fill="currentColor" className="size-4" />
                  <span className="shrink-0">Upgrade to Unlimited</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-2xl transition-all">
                  <Settings className="size-4" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-2xl transition-all">
                  <Award className="size-4" />
                  My Certificates
                </button>
                <div className="pt-1.5 mt-1.5 border-t border-gray-50">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    onClick={() => {
                      logout();
                    }}>
                    <LogOut stroke="currentColor" className="size-4" />
                    Logout
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
