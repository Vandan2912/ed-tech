const STORAGE_KEY = "mastishq_goal_profile";

export interface LocalGoalProfile {
  goal: string;
  subjects: string[];
}

const DEFAULT_PROFILE: LocalGoalProfile = {
  goal: "NEET Prep",
  subjects: ["Physics", "Chemistry", "Biology"],
};

// Backend has no endpoint for goal/subjects yet — stand-in local persistence
// until one exists. See onboarding step 3/4 for where this data is first collected.
export function getLocalGoalProfile(): LocalGoalProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.goal === "string" &&
      Array.isArray(parsed?.subjects)
    ) {
      return parsed;
    }
    return DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function setLocalGoalProfile(profile: LocalGoalProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable — nothing to persist to, ignore
  }
}

const LEVEL_DEADLINE_KEY = "mastishq_level_deadline";
const LEVEL_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

// No backend field for a per-level expiry exists yet — this keeps a rolling
// 3-day local countdown that resets whenever the level changes, so the UI has
// something real to count down instead of a static string.
export function getLevelCountdown(level: number): {
  days: number;
  hours: number;
  expired: boolean;
} {
  let deadline = 0;
  try {
    const raw = localStorage.getItem(LEVEL_DEADLINE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.level === level && typeof parsed?.deadline === "number") {
      deadline = parsed.deadline;
    }
  } catch {
    // ignore, fall through to reset below
  }

  if (!deadline) {
    deadline = Date.now() + LEVEL_WINDOW_MS;
    try {
      localStorage.setItem(
        LEVEL_DEADLINE_KEY,
        JSON.stringify({ level, deadline }),
      );
    } catch {
      // localStorage unavailable — countdown just won't persist across reloads
    }
  }

  const remainingMs = deadline - Date.now();
  const expired = remainingMs <= 0;
  const totalHours = Math.max(0, Math.floor(remainingMs / (60 * 60 * 1000)));

  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    expired,
  };
}
