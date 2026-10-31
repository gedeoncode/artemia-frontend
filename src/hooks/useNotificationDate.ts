// src/hooks/useNotificationDate.ts
// Shared date formatting hook for notification timestamps.

import { useMemo } from "react";

export function useNotificationDate(createdAt: string | Date) {
  return useMemo(() => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    let relativeTime = "";

    if (diffInMinutes < 1) {
      relativeTime = "Just now";
    } else if (diffInMinutes < 60) {
      relativeTime = `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInHours < 24) {
      relativeTime = `${Math.floor(diffInHours)}h ago`;
    } else {
      relativeTime = `${Math.floor(diffInDays)}d ago`;
    }

    const dateLabel = createdDate.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const isRecent = diffInHours < 24;

    return {
      dateLabel,
      relativeTime,
      isRecent,
    };
  }, [createdAt]);
}
