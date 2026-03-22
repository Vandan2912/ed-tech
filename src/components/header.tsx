import {
  Atom,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  ChartColumn,
  ChevronRight,
  Dna,
  Flame,
  FlaskConical,
  Home,
  LogOut,
  Menu,
  Settings,
  Target,
  Trophy,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { CoursesDropdown } from "./courses_drawer";

export function Header() {
  const { user, logout } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#1C398E] p-2 rounded-xl text-white">
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
                isActive ? "text-[#1C398E] bg-white shadow-sm text-center " : "hover:text-[#1C398E]"
              }`
            }>
            HOME
          </NavLink>
          <CoursesDropdown />

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
          <div className="hidden md:flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full text-sm group text-[#F54900] text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px] border border-[#FFD6A8CC]">
            <Flame size={16} className="group-hover:scale-110" /> 7
          </div>
          <div className="hidden md:flex items-center gap-1 bg-blue-50 text-[#155DFC] px-3 py-1.5 rounded-full text-sm border border-[#A9C8FFCC] group text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px]">
            <Zap size={16} fill="#155DFC" className="group-hover:scale-110" /> 4
          </div>

          <div className="relative w-9 h-9 flex-col shrink-0 p-0.5 rounded-full bg-[#F3F4F6] hidden md:flex justify-center items-center ">
            <Bell size={16} className="text-black" />
            <div className="absolute -top-1 -right-1 bg-[#FB2C36] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] flex w-4 h-4 justify-center items-center rounded-full text-white text-center text-[8px] not-italic font-black leading-3 tracking-[0.206px]">
              3
            </div>
          </div>
          <div className="hidden md:block w-px h-5 bg-[#E5E7EB] rounded-full"></div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="w-8 h-8 flex-col shrink-0 shadow-[0_0_0_2px_#E5E7EB,0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] rounded-full border-2 border-solid border-white flex justify-center items-center group focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {user?.profile_picture ? (
                  <img
                    src={!imgError ? user.profile_picture : "/default-avatar.png"}
                    onError={() => setImgError(true)}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                    loading="lazy"
                  />
                ) : (
                  <User size={16} className="text-black" />
                )}
              </button>
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
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all mb-1 group/upgrade focus-visible:outline-none">
                  <Zap fill="currentColor" className="size-4" />
                  <span className="shrink-0">Upgrade to Unlimited</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-2xl transition-all focus-visible:outline-none">
                  <Settings className="size-4" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-2xl transition-all focus-visible:outline-none">
                  <Award className="size-4" />
                  My Certificates
                </button>
                <div className="pt-1.5 mt-1.5 border-t border-gray-50">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all focus-visible:outline-none"
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

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "max-h-175 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
        } border-t border-gray-100 bg-white shadow-xl`}>
        <div className="px-4 py-6 space-y-4 bg-white">
          {/* GRID MENU */}
          <div className="grid grid-cols-2 gap-4">
            <MenuCard icon={<Home />} label="Home" active />
            <MenuCard icon={<BookOpen />} label="Courses" />
            <MenuCard icon={<Trophy />} label="Leaderboard" />
            <MenuCard icon={<BarChart3 />} label="Analytics" />
            <MenuCard icon={<Target />} label="Progress" />
            <MenuCard icon={<Users />} label="Study Room" />
          </div>

          {/* SUBJECT LIST */}
          <div className="pt-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">POPULAR SUBJECTS</p>

            <div className="space-y-2">
              <SubjectItem label="Maths" icon={<ChartColumn className="size-6" />} />
              <SubjectItem label="Physics" icon={<Atom className="size-6" />} />
              <SubjectItem label="Chemistry" icon={<FlaskConical className="size-6" />} />
              <SubjectItem label="Biology" icon={<Dna className="size-6" />} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuCard({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border ${
        active ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-0"
      } p-4 transition-all`}>
      <div className="mb-2 size-6">{icon}</div>
      <span className="text-xs font-black tracking-widest uppercase">{label}</span>
    </div>
  );
}

function SubjectItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="w-full flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-50 rounded-2xl transition-all group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">{icon}</div>
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      <ChevronRight className="size-4 text-gray-300" />
    </div>
  );
}
