import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Flame,
  LogOut,
  Search,
  Settings,
  User,
  Users,
  Pin,
  Zap,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { CoursesDropdown } from "./courses_drawer";
import { UpgradeModal } from "./UpgradeModal";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const teacherTabs = [
    { id: "alerts", label: "Alerts", path: "/", icon: Bell, badge: 5 },
    { id: "pin-message", label: "Pin Message", path: "/pin-message", icon: Pin },
    { id: "engagement", label: "Engagement", path: "/engagement", icon: BarChart3 },
    { id: "content", label: "Content", path: "/content", icon: BookOpen },
  ];

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-5 md:px-8">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <div className="bg-[#1C398E] p-2 rounded-xl text-white">
            <Brain size={20} />
          </div>
          {user?.role === "teacher" ? (
            <div className="flex flex-col">
              <span className="text-[#101828] text-[18px] font-black leading-[18px] tracking-[-0.4395px] -mt-0.5">
                SmartLearn
              </span>
              <span className="text-[#4f39f6] text-[10px] font-black uppercase tracking-[1.1172px]">
                Teacher Portal
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-[#101828] text-base not-italic font-black leading-5 tracking-[-0.712px] flex items-center gap-1.5">
                SmartLearn
                <span className="bg-[#DBEAFE] px-1.5 py-0.5 text-[#1447E6] text-[9px] not-italic font-black leading-[13.5px] tracking-[1.067px] uppercase rounded-[8px]">
                  AI
                </span>
              </span>
              <span className="text-[#6A7282] text-[11px] font-medium leading-tight mt-0.5">
                Your Learning Journey
              </span>
            </div>
          )}
        </div>

        {user?.role === "teacher" ? (
          <nav className="hidden md:flex items-center p-1.5 bg-[#f3f4f6] rounded-[16px]">
            {teacherTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;

              return (
                <div
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-[14px] cursor-pointer transition-colors ${isActive
                    ? tab.id === "alerts"
                      ? "text-[#e7000b]"
                      : "text-[#312c85]"
                    : "text-[#6a7282] hover:bg-white/50"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="teacher-nav"
                      className="absolute inset-0 bg-white shadow-sm rounded-[14px]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    <span className="text-[12px] font-black uppercase tracking-[1.2px]">
                      {tab.label}
                    </span>
                    {tab.badge && (
                      <span className="bg-[#fb2c36] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full -ml-1">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-0.5 p-1 text-sm text-[#6A7282] bg-[#F3F4F6E5] rounded-full border border-[#E5E7EBCC] text-[11px] not-italic font-black leading-[16.5px] tracking-[1.164px] uppercase">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex justify-center items-center px-3.75 py-1.5 rounded-full ${isActive
                  ? "text-[#1C398E] bg-white shadow-sm text-center "
                  : "hover:text-[#1C398E]"
                }`
              }
            >
              HOME
            </NavLink>
            <CoursesDropdown />

            <NavLink
              to="/ranks"
              className={({ isActive }) =>
                `flex justify-center items-center px-3.75 py-1.5 rounded-full ${isActive
                  ? "text-[#1C398E] bg-white shadow-sm text-center "
                  : "hover:text-[#1C398E]"
                }`
              }
            >
              RANKS
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `flex justify-center items-center px-3.75 py-1.5 rounded-full ${isActive
                  ? "text-[#1C398E] bg-white shadow-sm text-center "
                  : "hover:text-[#1C398E]"
                }`
              }
            >
              STATS
            </NavLink>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `flex justify-center items-center px-3.75 py-1.5 rounded-full ${isActive
                  ? "text-[#1C398E] bg-white shadow-sm text-center "
                  : "hover:text-[#1C398E]"
                }`
              }
            >
              PROGRESS
            </NavLink>
            <NavLink
              to="/study"
              className={({ isActive }) =>
                `flex justify-center items-center px-3.75 py-1.5 rounded-full ${isActive
                  ? "text-[#1C398E] bg-white shadow-sm text-center "
                  : "hover:text-[#1C398E]"
                }`
              }
            >
              <Users size={16} className="me-1.75" /> STUDY
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user?.role !== "teacher" && (
            <>
              <div className="hidden md:flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full text-sm group text-[#F54900] text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px] border border-[#FFD6A8CC]">
                <Flame size={16} className="group-hover:scale-110" /> 7
              </div>
              <div className="hidden md:flex items-center gap-1 bg-blue-50 text-[#155DFC] px-3 py-1.5 rounded-full text-sm border border-[#A9C8FFCC] group text-center text-[11px] not-italic font-black leading-[16.5px] tracking-[0.064px]">
                <Zap
                  size={16}
                  fill="#155DFC"
                  className="group-hover:scale-110"
                />{" "}
                4
              </div>

              <div className="relative w-9 h-9 flex-col shrink-0 p-0.5 rounded-full bg-[#F3F4F6] hidden md:flex justify-center items-center ">
                <Bell size={16} className="text-black" />
                <div className="absolute -top-1 -right-1 bg-[#FB2C36] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] flex w-4 h-4 justify-center items-center rounded-full text-white text-center text-[8px] not-italic font-black leading-3 tracking-[0.206px]">
                  3
                </div>
              </div>
              <div className="hidden md:block w-px h-5 bg-[#E5E7EB] rounded-full"></div>

              <button
                aria-label="Search"
                className="md:hidden w-9 h-9 flex items-center justify-center bg-[#F3F4F6] hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <Search size={18} />
              </button>
              <button
                aria-label="Notifications"
                className="md:hidden relative w-9 h-9 flex items-center justify-center bg-[#F3F4F6] hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FB2C36] rounded-full ring-2 ring-white" />
              </button>
            </>
          )}

          {user?.role === "teacher" && (
            <div className="hidden md:flex flex-col items-end mr-3">
              <span className="text-[#101828] text-[14px] font-bold tracking-[-0.1504px] leading-tight">
                {user?.first_name || ""}
              </span>
              <span className="text-[#615fff] text-[10px] font-bold uppercase tracking-[1.1172px] leading-tight mt-0.5">
                Teacher
              </span>
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <button className="w-8 h-8 flex-col shrink-0 shadow-[0_0_0_2px_#E5E7EB,0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] rounded-full border-2 border-solid border-white flex justify-center items-center group focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {user?.profile_picture ? (
                  <img
                    src={
                      !imgError ? user.profile_picture : "/default-avatar.png"
                    }
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
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Active {user?.role}
                  </p>
                  <p className="font-bold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
              </div>
              <div className="px-2 space-y-0.5">
                <button
                  onClick={() => setUpgradeOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all mb-1 group/upgrade focus-visible:outline-none"
                >
                  <Zap fill="currentColor" className="size-4" />
                  <span className="shrink-0">Upgrade to Unlimited</span>
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-2xl transition-all focus-visible:outline-none">
                  <Settings className="size-4" />
                  Profile Settings
                </button>
                <button
                  onClick={() => navigate("/certificates")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-2xl transition-all focus-visible:outline-none">
                  <Award className="size-4" />
                  My Certificates
                </button>
                <div className="pt-1.5 mt-1.5 border-t border-gray-50">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all focus-visible:outline-none"
                    onClick={() => {
                      logout();
                    }}
                  >
                    <LogOut stroke="currentColor" className="size-4" />
                    Logout
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {
            user?.role === "teacher" && (
              <button className="flex w-10 h-10 items-center justify-center px-2.5 py-0 relative bg-red-50 rounded-[14px] cursor-pointer"
                onClick={() => {
                  logout();
                }}>
                <LogOut size={20} stroke="#FB2C36" />
              </button>
            )
          }
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </header>
  );
}
