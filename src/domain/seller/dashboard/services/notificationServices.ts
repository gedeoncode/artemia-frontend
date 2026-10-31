import { apiFetch } from "@/lib/fetchLayers/apiFetch";
import {
  Notification,
  NotificationsResponse,
} from "../types/notificationTypes";

export const fetchNotifications = async (
  page: number = 1,
  limit: number = 10,
  token?: string,
  options?: RequestInit,
): Promise<NotificationsResponse> => {
  return await apiFetch<NotificationsResponse>(
    `/api/seller/notifications?page=${page}&limit=${limit}`,
    {
      method: "GET",
      requireAuth: true,
      token,
      ...options,
    },
  );
};

export const markNotificationRead = async (notificationId: string) => {
  return await apiFetch<Notification>(
    `/api/seller/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      requireAuth: true,
    },
  );
};
export const markAllNotificationsRead = async (
  token?: string,
  options?: RequestInit,
): Promise<Notification> => {
  return await apiFetch<Notification>(`/api/seller/notifications/read-all`, {
    method: "PATCH",
    requireAuth: true,
    token,
    ...options,
  });
};
