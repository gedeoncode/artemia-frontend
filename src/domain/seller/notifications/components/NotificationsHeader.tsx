import React from "react";
import { Button } from "@/components/ui/button/Button";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface Props {
  totalCount: number;
  unreadCount: number;
  isFetching: boolean;
  isMarkAllLoading: boolean;
  onRefresh: () => void;
  onMarkAll: () => void;
}

export function NotificationsHeader({
  totalCount,
  unreadCount,
  isFetching,
  isMarkAllLoading,
  onRefresh,
  onMarkAll,
}: Props) {
  const hasUnread = unreadCount > 0;

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-sm text-gray-600">
          {totalCount} total • {unreadCount} unread
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAll}
          disabled={isMarkAllLoading || !hasUnread}
        >
          <CheckCircle2
            className={`w-4 h-4 mr-2 ${isMarkAllLoading ? "animate-spin" : ""}`}
          />
          {isMarkAllLoading ? "Marking..." : "Mark All Read"}
        </Button>
      </div>
    </div>
  );
}
