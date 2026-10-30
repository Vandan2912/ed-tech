const GOAL_KEY = "mastishq_daily_goal";
const COUNT_KEY = "mastishq_daily_count";
const DEFAULT_GOAL = 40;

// No backend for daily practice goals yet — stand-in local persistence, the
// same approach as localProfile.ts. The count resets each calendar day.
const today = () => new Date().toISOString().slice(0, 10);

export function getDailyGoal(): number {
  try {
    const n = Number(localStorage.getItem(GOAL_KEY));
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_GOAL;
  } catch {
    return DEFAULT_GOAL;
  }
}

export function setDailyGoal(goal: number) {
  try {
    localStorage.setItem(GOAL_KEY, String(goal));
  } catch {
    // localStorage unavailable — nothing to persist to, ignore
  }
}

export function getTodayCount(): number {
  try {
    const raw = JSON.parse(localStorage.getItem(COUNT_KEY) ?? "null");
    return raw?.date === today() ? Number(raw.count) || 0 : 0;
  } catch {
    return 0;
  }
}

export function incrementTodayCount() {
  try {
    localStorage.setItem(
      COUNT_KEY,
      JSON.stringify({ date: today(), count: getTodayCount() + 1 }),
    );
  } catch {
    // ignore
  }
}
