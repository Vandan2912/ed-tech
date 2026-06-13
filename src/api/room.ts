import { api } from "@/lib/api";

export interface RoomDashboard {
  activeRooms: number;
  subjectsActive: number;
  studentsOnline: number;
}

export interface Room {
  id: number;
  topic: string;
  subject: string;
  host_id: string;
  max_learners: number;
  created_at: string;
  is_active: boolean;
  topic_normalized: string;
  is_private: boolean;
  learners: string;
}

export const getRoomDashboard = async (): Promise<RoomDashboard> => {
  const res = await api.get("/room/dashboard");
  return res.data.data;
};

export const getRooms = async (): Promise<Room[]> => {
  const res = await api.get("/room");
  return res.data;
};

export const joinRoom = async (id: number): Promise<void> => {
  await api.post(`/room/${id}/join`);
};

export const leaveRoom = async (id: number): Promise<void> => {
  await api.post(`/room/${id}/leave`);
};

export interface RoomParticipant {
  user_id: string;
  name: string;
  is_host: boolean;
}

export interface RoomGoal {
  id: number;
  goal: string;
}

export interface RoomDetails {
  room: {
    id: number;
    topic: string;
    subject: string;
    created_at: string;
    is_active: boolean;
  };
  host: {
    id: string;
    name: string;
    streak: number;
  };
  learners: {
    current: number;
    max: number;
  };
  participants: RoomParticipant[];
  user_role: "host" | "learner";
  session: {
    is_live: boolean;
    time_ago: string;
  };
  goals: RoomGoal[];
  feed: Record<
    string,
    Array<{ id: number; prompt: string; response: string; created_at: string }>
  >;
}

export const getRoomDetails = async (
  id: number | string,
): Promise<RoomDetails> => {
  const res = await api.get(`/room/${id}`);
  return res.data;
};

export interface CreateRoomPayload {
  topic: string;
  subject: string;
  goals: string[];
}

export const createRoom = async (payload: CreateRoomPayload): Promise<Room> => {
  const res = await api.post("/room", payload);
  return res.data;
};

export interface InviteUser {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  level?: number;
  subject?: string;
}

export const getInviteUsers = async (
  roomId: number | string,
): Promise<InviteUser[]> => {
  const res = await api.get(`/room/${roomId}/invite-users`);
  const payload = res.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const inviteUser = async (
  roomId: number | string,
  userId: string,
): Promise<void> => {
  await api.post(`/room/${roomId}/invite`, { userId });
};
