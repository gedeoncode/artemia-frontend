import { memo, useMemo } from "react";
import {
  Notification,
  NOTIFICATION_TYPES,
} from "../../types/notificationTypes";
import { Clock } from "lucide-react";
import { cx } from "@/lib/utils/classNames";
import { useNotificationDate } from "@/hooks/useNotificationDate";
import { useMarkNotificationRead } from "../../../../../app/(seller)/seller/dashboard/hooks/useMarkNotificationRead";

type NotificationsSectionProps = {
  notifications: Notification[];
  userId: string;
  navigateTo: (path: string) => void;
};

export const NotificationsSection = memo(function NotificationsSection({
  notifications,
  userId,
  navigateTo,
}: NotificationsSectionProps) {
  const markRead = useMarkNotificationRead();

  const unreadOnly = useMemo(() => {
    return notifications.filter((n) =>
      n.recipients.some((r) => r.userId === userId && !r.read),
    );
  }, [notifications, userId]);

  /** 2️⃣ Precompute typeConfig + isRead  */
  const processed = useMemo(() => {
    return unreadOnly.slice(0, 5).map((n) => {
      const isRead = n.recipients.some((r) => r.userId === userId && r.read);

      const cfg = NOTIFICATION_TYPES[n.type] || {};
      const typeConfig = {
        ...cfg,
        bgClass: cfg.bgClass || "bg-gray-100",
        textClass: cfg.textClass || "text-gray-700",
      };

      return { ...n, isRead, typeConfig };
    });
  }, [unreadOnly, userId]);

  const withDates = processed.map((n) => ({
    ...n,
    date: useNotificationDate(n.createdAt),
  }));

  return (
    <div className="p-4 transition-all bg-white shadow-sm sm:p-6 rounded-xl hover:shadow-md ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-transparent sm:text-xl bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 bg-clip-text">
          Quick Notifications
        </h2>

        <button
          onClick={() => navigateTo("/seller/dashboard/notifications")}
          className="text-xs font-medium text-transparent sm:text-sm bg-gradient-to-r from-red-900 via-blue-600 to-purple-700 bg-clip-text hover:underline"
        >
          View All
        </button>
      </div>

      {/* Empty state */}
      {withDates.length === 0 ? (
        <div className="p-4 text-center rounded-md bg-gray-50">
          <p className="text-gray-500">No unread notifications</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {withDates.map((n) => (
            <li
              key={n._id}
              onClick={() => {
                markRead.mutate(n._id);
                navigateTo("/seller/dashboard/notifications");
              }}
              className={cx(
                "group cursor-pointer rounded-lg p-4 border transition-all flex items-start gap-3",
                n.isRead
                  ? "bg-white hover:bg-gray-50 border-gray-200"
                  : "bg-blue-50/70 border-blue-200 shadow-sm hover:shadow-md",
              )}
            >
              {/* Icon */}
              <div
                className={cx(
                  "p-2 rounded-lg flex-shrink-0",
                  n.typeConfig.bgClass,
                )}
              >
                {n.typeConfig.icon && (
                  <n.typeConfig.icon
                    className={cx("w-5 h-5", n.typeConfig.textClass)}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cx(
                    "mt-1 text-sm line-clamp-2",
                    n.isRead ? "text-gray-500" : "text-gray-800",
                  )}
                >
                  {n.message}
                </p>

                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {n.date.relativeTime}
                </div>
              </div>

              {!n.isRead && (
                <span className="mt-1 ml-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 animate-pulse"></span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
