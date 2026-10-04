import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  Gem,
  HelpCircle,
  LogOut,
  Pin,
  User,
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
import { useEffect, useState } from "react";
import { UpgradeModal } from "./UpgradeModal";
import { getMyBest } from "@/api/ranks";
import logoMark from "@/assets/home/logo-mark.svg";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [best, setBest] = useState<{ level: number; totalXp: number } | null>(
    null,
  );

  useEffect(() => {
    if (user?.role !== "teacher") {
      getMyBest()
        .then(({ level, totalXp }) => setBest({ level, totalXp }))
        .catch(() => {});
    }
  }, [user?.role]);

  const teacherTabs = [
    { id: "alerts", label: "Alerts", path: "/", icon: Bell },
    {
      id: "homework",
      label: "Homework",
      path: "/homework",
      icon: ClipboardList,
    },
    {
      id: "pin-message",
      label: "Pin Message",
      path: "/pin-message",
      icon: Pin,
    },
    {
      id: "engagement",
      label: "Engagement",
      path: "/engagement",
      icon: BarChart3,
    },
    { id: "content", label: "Content", path: "/content", icon: BookOpen },
  ];

  return (
    <header className="border-b border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[53px] md:h-16 px-4 md:px-6">
        <div
          className="flex items-center gap-1.5 md:gap-2.5 cursor-pointer"
          onClick={() => navigate("/")}>
          <img
            src="/logo.svg"
            alt="Mastishq.ai"
            className="hidden md:block h-5 w-auto"
          />
          <span className="flex md:hidden items-center gap-1.5">
            <img src={logoMark} alt="" width={28} height={26} />
            <span className="text-[16px] font-extrabold text-[#060c5e]">
              Mastishq
            </span>
          </span>
          {user?.role === "teacher" && (
            <span className="text-[#4f39f6] text-[10px] font-black uppercase tracking-[1.1172px]">
              Teacher Portal
            </span>
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
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-[14px] cursor-pointer transition-colors ${
                    isActive
                      ? tab.id === "alerts"
                        ? "text-[#e7000b]"
                        : "text-[#312c85]"
                      : "text-[#6a7282] hover:bg-white/50"
                  }`}>
                  {isActive && (
                    <motion.div
                      layoutId="teacher-nav"
                      className="absolute inset-0 bg-white shadow-sm rounded-[14px]"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    <span className="text-[12px] font-black uppercase tracking-[1.2px]">
                      {tab.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-1 bg-white rounded px-1.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 text-[12px] font-bold ${
                  isActive
                    ? "text-[var(--auth-primary-dark-2)] border-b-2 border-[var(--auth-primary-dark-3)]"
                    : "text-[var(--auth-neutral-900)] font-medium hover:text-[var(--auth-primary-dark-2)]"
                }`
              }>
              Home
            </NavLink>
            <NavLink
              to="/ranks"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 text-[12px] font-bold rounded ${
                  isActive
                    ? "text-[var(--auth-primary-dark-2)] border-b-2 border-[var(--auth-primary-dark-3)]"
                    : "text-[var(--auth-neutral-900)] font-medium hover:text-[var(--auth-primary-dark-2)]"
                }`
              }>
              Leaderboard
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 text-[12px] font-bold rounded ${
                  isActive
                    ? "text-[var(--auth-primary-dark-2)] border-b-2 border-[var(--auth-primary-dark-3)]"
                    : "text-[var(--auth-neutral-900)] font-medium hover:text-[var(--auth-primary-dark-2)]"
                }`
              }>
              Insight
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          {user?.role !== "teacher" && best && (
            <div className="flex md:hidden items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#f0f9ff] text-[11px] font-bold text-[var(--auth-primary)] whitespace-nowrap">
                <Zap
                  size={10}
                  className="text-[var(--auth-primary)]"
                  fill="var(--auth-primary)"
                />
                Lvl {best.level}
              </span>
              <span className="px-2 py-1 rounded-xl bg-[#eef2ff] text-[11px] font-bold text-[#233ae8] whitespace-nowrap">
                {best.totalXp.toLocaleString()} pts
              </span>
            </div>
          )}

          {user?.role !== "teacher" && best && (
            <div className="hidden md:flex items-center gap-2 bg-white border-[0.5px] border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] shadow-[0px_16px_20px_rgba(88,92,95,0.11)] rounded-[14px] px-3 py-1.5">
              <Zap
                size={14}
                className="text-[var(--auth-primary-dark-3)]"
                fill="var(--auth-primary-dark-3)"
              />
              <span className="text-[13px] font-bold text-[var(--auth-primary-dark-3)] whitespace-nowrap">
                Lvl {best.level}
              </span>
              <span className="w-px h-3 bg-[var(--auth-neutral-300)]" />
              <span className="text-[13px] font-bold text-[var(--auth-secondary-light-2)] whitespace-nowrap">
                {best.totalXp.toLocaleString()} pts
              </span>
            </div>
          )}

          {user?.role === "teacher" && (
            <div className="hidden md:flex flex-col items-end mr-1">
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
              <button className="flex items-center gap-2 rounded-full focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="size-7 md:size-9 rounded-[14px] md:rounded-[18px] border border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] overflow-hidden flex items-center justify-center bg-[#f3f4f6]">
                  {user?.profile_picture ? (
                    <img
                      src={
                        !imgError
                          ? user.profile_picture
                          : "/default-avatar.png"
                      }
                      onError={() => setImgError(true)}
                      alt="profile"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <User size={16} className="text-[#606060]" />
                  )}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[220px] bg-white rounded-xl shadow-[0px_8px_20px_-6px_rgba(0,0,0,0.08)] border border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] p-0 gap-0 overflow-hidden">
              {user?.is_premium ? (
                <div className="flex items-center justify-between px-3 h-10 border-b border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))]">
                  <span
                    className="flex items-center justify-center h-6 px-3 rounded-md text-[11px] font-semibold text-[#594a08] capitalize"
                    style={{
                      backgroundImage:
                        "linear-gradient(109deg, var(--auth-yellow-300) 47%, var(--auth-yellow-100) 92%)",
                    }}>
                    Gold Elite
                  </span>
                  <span className="flex items-center gap-1 bg-[var(--auth-green-alpha-10)] rounded-full px-1.5 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--auth-green-300)]" />
                    <span className="text-[8px] font-medium text-[var(--auth-green-300)]">
                      Active
                    </span>
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setUpgradeOpen(true)}
                  className="w-full flex items-center justify-center h-11 border-b border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] px-3">
                  <span
                    className="flex items-center justify-center gap-2 h-8 w-[142px] rounded-lg shadow-[0px_6px_7px_rgba(0,0,0,0.1)]"
                    style={{
                      backgroundImage:
                        "linear-gradient(111deg, var(--auth-primary-dark-1) 21%, var(--auth-primary) 79%)",
                    }}>
                    <Gem size={16} className="text-white" />
                    <span className="text-[12px] font-semibold text-white">
                      Upgrade to Pro
                    </span>
                  </span>
                </button>
              )}
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center gap-2 h-10 px-3 text-[12px] font-medium text-[var(--auth-neutral-1000)] hover:bg-gray-50 border-b border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] focus-visible:outline-none">
                <User size={16} className="text-[var(--auth-primary-dark-2)]" />
                Profile
              </button>
              <a
                href="#"
                className="w-full flex items-center gap-2 h-10 px-3 text-[12px] font-medium text-[var(--auth-neutral-1000)] hover:bg-gray-50 border-b border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))] focus-visible:outline-none">
                <HelpCircle
                  size={16}
                  className="text-[var(--auth-primary-dark-2)]"
                />
                Help &amp; Support
              </a>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 h-10 px-3 text-[12px] font-medium text-[var(--auth-red-100)] hover:bg-red-50 focus-visible:outline-none">
                <LogOut size={16} className="text-[var(--auth-red-100)]" />
                Logout
              </button>
            </PopoverContent>
          </Popover>

          {user?.role === "teacher" && (
            <button
              className="flex w-10 h-10 items-center justify-center px-2.5 py-0 relative bg-red-50 rounded-[14px] cursor-pointer"
              onClick={() => logout()}>
              <LogOut size={20} stroke="#FB2C36" />
            </button>
          )}
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </header>
  );
}
