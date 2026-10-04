import { useState } from "react";
import { SquarePen } from "lucide-react";
import { getLocalGoalProfile } from "@/lib/localProfile";
import { UpdateGoalModal } from "./UpdateGoalModal";

export function Hero() {
  const [goal, setGoal] = useState(() => getLocalGoalProfile().goal);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative pt-8">
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

      <h1 className="text-center text-[32px] font-bold text-[#101828]">
        What will you master today?
      </h1>
      <p className="pt-2 text-center text-[15px] font-semibold text-[var(--auth-primary-dark-2)] max-w-2xl mx-auto">
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
