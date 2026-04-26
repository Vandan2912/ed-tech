import { api } from "@/lib/api";

export interface GlobalRankUser {
  rank: number;
  name: string;
  level: number;
  xp: number;
  avatar: string;
  positionChange: number;
  isCurrentUser?: boolean;
  image: string;
  badges?: number;
  league?: string;
  memberType?: string;
}

export interface GlobalRankResponse {
  topThree: GlobalRankUser[];
  leaderboard: GlobalRankUser[];
}

export const getGlobalRanks = async (): Promise<GlobalRankResponse> => {
  const res = await api.post("/global");
  return res.data;
};
