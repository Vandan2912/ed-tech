import { useState } from "react";
import { ChevronRight, SquarePen } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { getLocalGoalProfile } from "@/lib/localProfile";
import { UpdateGoalModal } from "./UpdateGoalModal";

export function Hero() {
  const [goal, setGoal] = useState(() => getLocalGoalProfile().goal);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="relative pt-5 sm:pt-8">
      {/* Mobile layout */}
      <div className="sm:hidden flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 w-full p-3 text-left bg-white border border-[#f3f4f6] rounded-2xl drop-shadow-[0px_4px_5px_#f3f4f6]">
          <span className="flex items-center justify-center size-8 rounded-full bg-[#f0f9ff] shrink-0">
            <SquarePen size={14} className="text-[var(--auth-primary)]" />
          </span>
          <span className="flex flex-col gap-0.5 flex-1 min-w-0 font-bold">
            <span className="text-[10px] uppercase text-[var(--auth-primary)]">
              My Goal
            </span>
            <span className="text-[14px] text-[#1e2939] truncate">{goal}</span>
          </span>
          <ChevronRight size={16} className="text-[#6b7280] shrink-0" />
        </button>

        <div className="flex flex-col gap-1 pt-3">
          {user?.first_name && (
            <p className="text-[13px] font-medium text-[#6b7280]">
              Hi {user.first_name}!
            </p>
          )}
          <h1 className="text-[24px] leading-[30px] font-extrabold text-[#1e2939]">
            What will you master today?
          </h1>
          <p className="text-[13px] leading-[1.4] text-[#99a1af]">
            AI generates a personalised 3-stage quiz from any topic — type,
            upload or scan.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="absolute right-0 top-[26px] hidden sm:flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-2xl pl-3 pr-4 py-2.5 shadow-[0px_10px_7.5px_#f3f4f6,0px_4px_3px_#f3f4f6]">
        <span className="flex items-center justify-center size-7 rounded-[14px] bg-[#f0f9ff] shrink-0">
          <SquarePen size={14} className="text-[var(--auth-primary-dark-2)]" />
        </span>
        <span className="flex flex-col items-start">
          <span className="text-[9px] font-semibold text-[var(--auth-primary-dark-3)]">
            My Goal
          </span>
          <span className="text-[12px] font-semibold text-[#364153]">
            {goal}
          </span>
        </span>
      </button>

      <h1 className="hidden sm:block text-center text-[32px] font-bold text-[#101828]">
        What will you master today?
      </h1>
      <p className="hidden sm:block pt-2 text-center text-[15px] font-semibold text-[var(--auth-primary-dark-2)] max-w-2xl mx-auto">
        AI generates a personalised 3-stage quiz from any topic — type, upload
        or scan.
      </p>

      <UpdateGoalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdated={(profile) => setGoal(profile.goal)}
      />
    </section>
  );
}
