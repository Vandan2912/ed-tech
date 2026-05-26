import { useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Brain,
  PlayCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NotificationType = "urgent" | "quiz" | "lesson" | "info" | "warning";

interface AppNotification {
  id: string;
  type: NotificationType;
  badge: string;
  time: string;
  title: string;
  description: string;
  from: string;
  read: boolean;
}

const typeConfig: Record<
  NotificationType,
  { icon: LucideIcon; accent: string; cardUnread: string; dot: string; badgeUnread: string }
> = {
  urgent: {
    icon: AlertCircle,
    accent: "text-[#fb2c36]",
    cardUnread: "bg-[#fef2f2] border-[#ffc9c9]",
    dot: "bg-[#fb2c36]",
    badgeUnread: "bg-[#fb2c36] text-white",
  },
  quiz: {
    icon: Brain,
    accent: "text-[#ad46ff]",
    cardUnread: "bg-[#faf5ff] border-[#e9d4ff]",
    dot: "bg-[#ad46ff]",
    badgeUnread: "bg-[#ad46ff] text-white",
  },
  lesson: {
    icon: PlayCircle,
    accent: "text-[#2b7fff]",
    cardUnread: "bg-[#eff6ff] border-[#bedbff]",
    dot: "bg-[#2b7fff]",
    badgeUnread: "bg-[#2b7fff] text-white",
  },
  info: {
    icon: Bell,
    accent: "text-[#6a7282]",
    cardUnread: "bg-[#eff6ff] border-[#bedbff]",
    dot: "bg-[#2b7fff]",
    badgeUnread: "bg-[#e5e7eb] text-[#6a7282]",
  },
  warning: {
    icon: AlertTriangle,
    accent: "text-[#f0b100]",
    cardUnread: "bg-[#fffbeb] border-[#ffe085]",
    dot: "bg-[#f0b100]",
    badgeUnread: "bg-[#f0b100] text-white",
  },
};

const initialNotifications: AppNotification[] = [
  {
    id: "1",
    type: "urgent",
    badge: "Urgent",
    time: "Just now",
    title: "Class Test Tomorrow!",
    description:
      "Reminder: Unit 3 Mathematics test is scheduled for tomorrow at 10:00 AM. Make sure to cover Chapters 7–9 and revise all formulas.",
    from: "Ms. Priya Sharma",
    read: false,
  },
  {
    id: "2",
    type: "quiz",
    badge: "Quiz",
    time: "1 hour ago",
    title: "New Quiz Assigned: Laws of Motion",
    description:
      "A new quiz on 'Laws of Motion' has been assigned. It covers Newton's 3 laws and friction. Due by Friday, Feb 28.",
    from: "Ms. Priya Sharma",
    read: false,
  },
  {
    id: "3",
    type: "lesson",
    badge: "Lesson",
    time: "3 hours ago",
    title: "New Lesson Published: Wave Optics Part 2",
    description:
      "'Wave Optics — Part 2' has been uploaded to your course. Watch it before your next class session on Thursday.",
    from: "Mr. Anil Kumar",
    read: false,
  },
  {
    id: "4",
    type: "info",
    badge: "Info",
    time: "Yesterday",
    title: "Schedule Change — Physics Class",
    description:
      "Thursday's Physics class is rescheduled to Friday 2:00 PM due to a school event. Please update your calendar accordingly.",
    from: "Ms. Priya Sharma",
    read: true,
  },
  {
    id: "5",
    type: "warning",
    badge: "Warning",
    time: "2 days ago",
    title: "Progress Falling Behind",
    description:
      "Your Chemistry module progress is below the weekly target (32% vs 60% expected). Please complete the 3 pending lessons this week.",
    from: "Mr. Anil Kumar",
    read: true,
  },
];

function NotificationCard({ notification }: { notification: AppNotification }) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;
  const { read } = notification;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-[16px] border-2 p-4",
        read ? "border-[#f3f4f6] bg-[#f9fafb]/60" : config.cardUnread,
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[14px]",
          read
            ? "bg-[#f3f4f6]"
            : "bg-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]",
        )}
      >
        <Icon size={16} className={read ? "text-[#6a7282]" : config.accent} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {!read && <span className={cn("size-2 shrink-0 rounded-full", config.dot)} />}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[1px]",
              read ? "bg-[#e5e7eb] text-[#6a7282]" : config.badgeUnread,
            )}
          >
            {notification.badge}
          </span>
          <span className="text-[9px] font-bold tracking-[0.17px] text-[#99a1af]">
            {notification.time}
          </span>
        </div>

        <h4
          className={cn(
            "text-[14px] font-black leading-[17.5px] tracking-[-0.15px]",
            read ? "text-[#6a7282]" : "text-[#101828]",
          )}
        >
          {notification.title}
        </h4>

        <p className="line-clamp-2 text-[12px] leading-[19.5px] text-[#6a7282]">
          {notification.description}
        </p>

        <p className="text-[10px] font-black uppercase tracking-[1.12px] text-[#99a1af]">
          From: {notification.from}
        </p>
      </div>
    </div>
  );
}

export function NotificationPanel({ onClose }: { onClose?: () => void }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const visible = useMemo(
    () => (filter === "unread" ? notifications.filter((n) => !n.read) : notifications),
    [notifications, filter],
  );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* header */}
      <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[14px] bg-[#ffe2e2]">
            <Bell size={16} className="text-[#fb2c36]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black uppercase leading-5 tracking-[0.55px] text-[#101828]">
              Notifications
            </span>
            <span className="text-[10px] leading-3.75 tracking-[0.12px] text-[#99a1af]">
              From your teachers
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close notifications"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-[14px] bg-[#f3f4f6] text-[#6a7282] transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]"
        >
          <X size={16} />
        </button>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="overflow-hidden rounded-[16px] border border-[#f3f4f6] bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
          {/* summary */}
          <div className="flex flex-col gap-3 border-b border-[#f9fafb] bg-linear-to-r from-[#fef2f2]/40 to-white px-5 pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="flex size-9 items-center justify-center rounded-[14px] bg-[#ffe2e2]">
                  <Bell size={20} className="text-[#fb2c36]" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-[#fb2c36] text-[9px] font-black tracking-[0.17px] text-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-black uppercase leading-4 tracking-[0.6px] text-[#101828]">
                  Teacher Alerts
                </span>
                <span className="text-[12px] leading-4 text-[#6a7282]">
                  {unreadCount} new messages from your teacher
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1 rounded-[14px] bg-[#f3f4f6] p-1">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={cn(
                    "rounded-[10px] px-3 py-1.5 text-[10px] font-black uppercase tracking-[1.12px] transition-colors",
                    filter === "all"
                      ? "bg-white text-[#155dfc] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                      : "text-[#6a7282]",
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("unread")}
                  className={cn(
                    "flex-1 rounded-[10px] px-3 py-1.5 text-[10px] font-black uppercase tracking-[1.12px] transition-colors",
                    filter === "unread"
                      ? "bg-white text-[#155dfc] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                      : "text-[#6a7282]",
                  )}
                >
                  Unread ({unreadCount})
                </button>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="rounded-[14px] bg-[#eff6ff] px-4 py-1.5 text-[10px] font-black uppercase tracking-[1.12px] text-[#155dfc] transition-colors hover:bg-[#dbeafe] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark all read
              </button>
            </div>
          </div>

          {/* list */}
          <div className="flex flex-col gap-2.5 p-4">
            {visible.length === 0 ? (
              <p className="py-8 text-center text-[12px] text-[#99a1af]">
                You're all caught up.
              </p>
            ) : (
              visible.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationBell({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        showClose={false}
        aria-describedby={undefined}
        className="w-full p-0 sm:max-w-md"
      >
        <SheetTitle className="sr-only">Notifications</SheetTitle>
        <NotificationPanel onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
