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

export interface CreateRoomPayload {
  topic: string;
  subject: string;
  goals: string[];
}

export const createRoom = async (payload: CreateRoomPayload): Promise<Room> => {
  const res = await api.post("/room", payload);
  return res.data;
};
