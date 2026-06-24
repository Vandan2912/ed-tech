import {
  BarChart3,
  Bell,
  BookOpen,
  Home,
  Pin,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/useAuth";
import { useTranslation } from "@/i18n/useTranslation";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  end?: boolean;
  badge?: number;
};

export function MobileBottomBar() {
  const { user } = useAuth();
  const t = useTranslation();

  const studentItems: NavItem[] = [
    { to: "/", label: t.mobileBar.home, icon: Home, end: true },
    { to: "/courses", label: t.mobileBar.courses, icon: BookOpen },
    { to: "/ranks", label: t.mobileBar.ranks, icon: Trophy },
    { to: "/progress", label: t.mobileBar.progress, icon: Target },
    { to: "/study", label: t.mobileBar.study, icon: Users },
  ];

  const teacherItems: NavItem[] = [
    { to: "/", label: t.mobileBar.alerts, icon: Bell, end: true, badge: 5 },
    { to: "/pin-message", label: t.mobileBar.pin, icon: Pin },
    { to: "/engagement", label: t.mobileBar.engage, icon: BarChart3 },
    { to: "/content", label: t.mobileBar.content, icon: BookOpen },
  ];

  const items = user?.role === "teacher" ? teacherItems : studentItems;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#F3F4F6] shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around px-2 pt-3 pb-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className="group flex flex-col items-center gap-1"
              >
                {({ isActive }) => (
                  <>
                    <div className="relative flex items-center justify-center size-10 rounded-2xl">
                      {isActive && (
                        <motion.div
                          layoutId="mobile-bottom-bar-active"
                          className="absolute inset-0 bg-[#155DFC] rounded-2xl shadow-[0_4px_4px_rgba(21,93,252,0.24)]"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 32,
                          }}
                        />
                      )}
                      <Icon
                        size={20}
                        className={`relative z-10 shrink-0 transition-colors ${
                          isActive ? "text-white" : "text-[#99A1AF]"
                        }`}
                      />
                      {item.badge ? (
                        <span className="absolute z-20 -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#FB2C36] text-white text-[8px] font-black leading-none rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <span
                      className={`text-[10px] font-bold leading-none transition-colors ${
                        isActive ? "text-[#155DFC]" : "text-[#99A1AF]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
