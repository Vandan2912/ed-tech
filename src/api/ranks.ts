import { api } from "@/lib/api";

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

export interface LeaderboardResponse {
  success: boolean;
  data: ApiLeaderboardUser[];
  weekly_rival: ApiLeaderboardUser | null;
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

export const getLeaderboard = async (): Promise<GlobalRankResponse> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/xp/leaderboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: LeaderboardResponse = res.data;
  const sorted = [...body.data].sort(
    (a, b) => parseInt(a.rank) - parseInt(b.rank)
  );
  const mapped = sorted.map(toGlobalRankUser);

  return {
    topThree: mapped.filter((u) => u.rank <= 3),
    leaderboard: mapped.filter((u) => u.rank > 3),
    weeklyRival: body.weekly_rival ? toGlobalRankUser(body.weekly_rival) : null,
  };
};
