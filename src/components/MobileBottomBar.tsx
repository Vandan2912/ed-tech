import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Home,
  Pin,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  end?: boolean;
  badge?: number;
};

const studentItems: NavItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/ranks", label: "Leaderboard", icon: Award },
  { to: "/stats", label: "Insights", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
];

const teacherItems: NavItem[] = [
  { to: "/", label: "Alerts", icon: Bell, end: true, badge: 5 },
  { to: "/pin-message", label: "Pin", icon: Pin },
  { to: "/engagement", label: "Engage", icon: BarChart3 },
  { to: "/content", label: "Content", icon: BookOpen },
];

export function MobileBottomBar() {
  const { user } = useAuth();
  const items = user?.role === "teacher" ? teacherItems : studentItems;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#f1f5f9] drop-shadow-[0px_-4px_6px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <ul className="flex h-[72px] items-center justify-between px-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="min-w-[60px]">
              <NavLink
                to={item.to}
                end={item.end}
                className="flex flex-col items-center gap-1">
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icon
                        size={20}
                        className={cn(
                          "transition-colors",
                          isActive
                            ? "text-[var(--auth-primary)]"
                            : "text-[#99a1af]",
                        )}
                      />
                      {item.badge ? (
                        <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-[#fb2c36] text-white text-[8px] font-black leading-none rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] transition-colors whitespace-nowrap",
                        isActive
                          ? "font-bold text-[var(--auth-primary)]"
                          : "font-medium text-[#99a1af]",
                      )}>
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
