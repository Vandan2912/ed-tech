export type Player = {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  change: number;
  isYou?: boolean;
};

export const players: Player[] = [
  {
    rank: 1,
    name: "Arjun Mehta",
    xp: 2450,
    level: 24,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    change: 2,
  },
  {
    rank: 2,
    name: "Sara Khan",
    xp: 2320,
    level: 22,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    change: 1,
  },
  {
    rank: 3,
    name: "Leo Das",
    xp: 2210,
    level: 21,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    change: -1,
  },
  {
    rank: 5,
    name: "You",
    xp: 1850,
    level: 18,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    change: 2,
    isYou: true,
  },
];