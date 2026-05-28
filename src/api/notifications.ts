import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface PinnedMessage {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  teacherId: string;
  teacherName: string;
}

interface ApiPinnedMessage {
  id: string;
  title: string;
  message: string;
  created_at: string;
  teacher_id: string;
  teacher_name: string;
}

interface ApiPinnedMessagesResponse {
  success: boolean;
  count: number;
  data: ApiPinnedMessage[];
}

const READ_IDS_KEY = "notifications:readIds";
const NOTIFICATIONS_UPDATED_EVENT = "notifications:updated";

export function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function persistReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore quota / disabled storage */
  }
}

/** Notify subscribed components (e.g. the Header badge) that read-state or
 *  pinned-message data has changed and they should refetch. */
export function notifyNotificationsUpdated() {
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}

/** Pinned-message count minus the IDs marked read in localStorage. Refreshes
 *  on mount, when another tab writes to storage, and when `notifyNotifications-
 *  Updated()` fires in this tab. */
export function useUnreadAlertsCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const messages = await getPinnedMessages();
        if (cancelled) return;
        const readIds = loadReadIds();
        setCount(messages.filter((m) => !readIds.has(m.id)).length);
      } catch (err) {
        console.error("Failed to load unread alerts count", err);
        if (!cancelled) setCount(0);
      }
    };

    refresh();

    const onUpdate = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === READ_IDS_KEY) refresh();
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return count;
}

export const getPinnedMessages = async (): Promise<PinnedMessage[]> => {
  const token = localStorage.getItem("token");
  const res = await api.get<ApiPinnedMessagesResponse>("/message/pinned-messages", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res?.data?.data ?? [];
  return data.map((m) => ({
    id: m.id,
    title: m.title,
    message: m.message,
    createdAt: m.created_at,
    teacherId: m.teacher_id,
    teacherName: m.teacher_name,
  }));
};

export const pinMessage = async (payload: {
  title: string;
  message: string;
}): Promise<void> => {
  const token = localStorage.getItem("token");
  await api.post("/message/pin-message", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
