import { api } from "@/lib/api";

export interface ClassLeaderboardUser {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  profile_image: string | null;
  rank: number;
  xp: number;
  level: number;
  rank_change: string;
  rank_color: string;
  xp_to_next_level: number;
  is_current_user: boolean;
}

export interface ClassLeaderboardResponse {
  success: boolean;
  class: string;
  my_rank: ClassLeaderboardUser;
  top_three: ClassLeaderboardUser[];
  leaderboard: ClassLeaderboardUser[];
}

export const getClassLeaderboard = async (period: "all" | "week" | "month" = "all"): Promise<ClassLeaderboardResponse> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/leaderboard/class", {
    params: { period },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export interface ApiLeaderboardUser {
  id: string;
  name: string;
  profile_image: string | null;
  rank: string;
  xp: number;
  level: number;
  rank_change: string;
  rank_color: string;
  xp_to_next_level: number;
  is_current_user: boolean;
}

export interface ApiWeeklyRival {
  id: string;
  name: string;
  profile_image: string | null;
  rank: string;
  xp: number;
  level: number;
  xp_ahead: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: ApiLeaderboardUser[];
  weekly_rival: ApiWeeklyRival | null;
}

export interface GlobalRankUser {
  id: string;
  rank: number;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatar: string;
  positionChange: number;
  rankColor: string;
  isCurrentUser?: boolean;
  image: string;
  badges?: number;
  league?: string;
  memberType?: string;
}

export interface GlobalRankResponse {
  topThree: GlobalRankUser[];
  leaderboard: GlobalRankUser[];
  weeklyRival: GlobalRankUser | null;
}

function toGlobalRankUser(u: ApiLeaderboardUser): GlobalRankUser {
  const rank = parseInt(u.rank, 10);
  const initials = u.name.slice(0, 2).toUpperCase();
  const positionChange = parseInt(u.rank_change.replace("+", ""), 10) || 0;
  return {
    id: u.id,
    rank,
    name: u.name,
    level: u.level,
    xp: u.xp,
    xpToNextLevel: u.xp_to_next_level,
    avatar: initials,
    positionChange,
    rankColor: u.rank_color,
    isCurrentUser: u.is_current_user,
    image: u.profile_image ?? "",
  };
}

function rivalToGlobalRankUser(u: ApiWeeklyRival): GlobalRankUser {
  return {
    id: u.id,
    rank: parseInt(u.rank, 10),
    name: u.name,
    level: u.level,
    xp: u.xp,
    xpToNextLevel: u.xp_ahead,
    avatar: u.name.slice(0, 2).toUpperCase(),
    positionChange: 0,
    rankColor: "",
    isCurrentUser: false,
    image: u.profile_image ?? "",
  };
}

export interface ApiStreakUser {
  id: string;
  first_name: string;
  profile_picture: string | null;
  current_streak: number;
  rank: string;
  is_current_user: boolean;
}

export interface ApiStreaksResponse {
  success: boolean;
  data: {
    global_streak: number;
    subjects: unknown[];
    top_streaks: ApiStreakUser[];
    user_percentile: string;
  };
}

export interface StreakUser {
  id: string;
  rank: number;
  name: string;
  streakDays: number;
  image: string;
  avatar: string;
  isCurrentUser: boolean;
}

export interface StreaksData {
  globalStreak: number;
  topStreaks: StreakUser[];
  userPercentile: number;
}

export const getStreaks = async (): Promise<StreaksData> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/xp/streaks", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: ApiStreaksResponse = res?.data;
  const { global_streak, top_streaks, user_percentile } = body.data;

  return {
    globalStreak: global_streak,
    userPercentile: parseInt(user_percentile, 10),
    topStreaks: top_streaks.map((u, i) => ({
      id: u.id,
      rank: i + 1,
      name: u.first_name,
      streakDays: u.current_streak,
      image: u.profile_picture ?? "",
      avatar: u.first_name.slice(0, 2).toUpperCase(),
      isCurrentUser: u.is_current_user,
    })),
  };
};

export interface ApiMyBestXpEntry {
  xp: number;
  label: string;
  event_type: string;
  created_at: string;
}

export interface ApiMyBestResponse {
  success: boolean;
  data: {
    level: number;
    total_xp: number;
    progress: {
      current: number;
      required: number;
      percent: number;
    };
    recent_xp: ApiMyBestXpEntry[];
  };
}

export interface MyBestData {
  level: number;
  totalXp: number;
  progress: { current: number; required: number; percent: number };
  recentXp: { xp: number; label: string; eventType: string; createdAt: string }[];
}

export const getMyBest = async (): Promise<MyBestData> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/xp/mybest", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: ApiMyBestResponse = res?.data;
  const { level, total_xp, progress, recent_xp } = body.data;

  return {
    level,
    totalXp: total_xp,
    progress,
    recentXp: recent_xp.map((e) => ({
      xp: e.xp,
      label: e.label,
      eventType: e.event_type,
      createdAt: e.created_at,
    })),
  };
};

export const getLeaderboard = async (): Promise<GlobalRankResponse> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/xp/leaderboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: LeaderboardResponse = res?.data;
  const sorted = [...body.data].sort(
    (a, b) => parseInt(a.rank) - parseInt(b.rank),
  );
  const mapped = sorted.map(toGlobalRankUser);

  return {
    topThree: mapped.filter((u) => u.rank <= 3),
    leaderboard: mapped.filter((u) => u.rank > 3),
    weeklyRival: body.weekly_rival
      ? rivalToGlobalRankUser(body.weekly_rival)
      : null,
  };
};
