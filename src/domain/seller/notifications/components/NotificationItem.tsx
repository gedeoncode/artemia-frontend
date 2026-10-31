import React, { memo, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ExternalLink, Clock } from "lucide-react";
import { motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cx } from "@/lib/utils/classNames";
import { useNotificationDate } from "@/hooks/useNotificationDate";
import {
  NOTIFICATION_TYPES,
  Notification,
} from "@/domain/seller/dashboard/types/notificationTypes";

interface NotificationItemProps {
  notification: Notification;
  userId: string;
  onMarkRead: (id: string) => void;
  isActionActive: boolean;
}

export const NotificationItem = memo(function NotificationItem({
  notification,
  userId,
  onMarkRead,
  isActionActive,
}: NotificationItemProps) {
  const { title, message, createdAt, link, type, priority, recipients, _id } =
    notification;
  const router = useRouter();
  /** Derived state */
  const isRead = useMemo(
    () => recipients.some((r) => r.userId === userId && r.read),
    [recipients, userId],
  );
  const { dateLabel, relativeTime, isRecent } = useNotificationDate(createdAt);
  /** Type configuration mapping */
  const typeConfig = useMemo(() => {
    const cfg = NOTIFICATION_TYPES[type];
    return {
      ...cfg,
      bgClass: cfg?.bgClass || "bg-gray-100",
      textClass: cfg?.textClass || "text-gray-700",
      badgeClass: cfg?.badgeClass || "border-gray-300 text-gray-700",
    };
  }, [type]);

  const Icon = typeConfig.icon;

  const handleLinkClick = useCallback(
    (event: React.MouseEvent) => {
      // Auto-mark as read when clicking link if not already read
      if (!isRead && !isActionActive) {
        setTimeout(() => onMarkRead(_id), 500);
      }
      router.push(`/seller/dashboard/${link}` || "/seller/dashboard/orders");
    },
    [isRead, isActionActive, onMarkRead, _id, link, router],
  );

  return (
    <TooltipProvider>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Card
          className={[
            "transition-all duration-200 rounded-xl border group cursor-default",
            isRead
              ? "bg-white border-neutral-200 hover:shadow-sm"
              : "bg-blue-50/70 border-blue-200 shadow-sm hover:shadow-md",
          ].join(" ")}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`p-2 rounded-lg flex-shrink-0 mt-1 ${typeConfig.bgClass}`}
              >
                {Icon && <Icon className={`w-5 h-5 ${typeConfig.textClass}`} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3
                            id={`notification-title-${_id}`}
                            className={cx(
                              "text-sm font-semibold truncate",
                              isRead
                                ? "text-muted-foreground"
                                : "text-foreground",
                            )}
                          >
                            {title}
                          </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{title}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Type Badge */}
                      <Badge
                        variant="outline"
                        className={`${typeConfig.badgeClass} text-xs`}
                      >
                        {type}
                      </Badge>

                      {/* Priority */}
                      {priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>

                    {/* Message */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p
                          id={`notification-desc-${_id}`}
                          className={cx(
                            "text-sm leading-relaxed whitespace-pre-line line-clamp-2",
                            isRead
                              ? "text-muted-foreground"
                              : "text-foreground",
                          )}
                        >
                          {message}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="max-w-sm p-3 text-sm"
                      >
                        <p className="whitespace-pre-line">{message}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Optional link */}
                    {link && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={handleLinkClick}
                            className={cx()}
                            aria-label={`View details for ${title}`}
                          >
                            View details
                            <ExternalLink
                              className="w-3 h-3"
                              aria-hidden="true"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open related content</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between mt-4">
                  {/* Timestamp */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <time
                        className={cx(
                          "flex items-center gap-1 text-xs",
                          isRecent && !isRead
                            ? "text-foreground font-medium"
                            : "text-muted-foreground",
                        )}
                        dateTime={new Date(createdAt).toISOString()}
                      >
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {relativeTime}
                      </time>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{dateLabel}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Right Actions */}
                  {isRead ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 className="w-4 h-4" /> Read
                    </span>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={isActionActive}
                          onClick={() => onMarkRead(_id)}
                          className="transition-all duration-200 rounded-lg min-w-[90px]"
                        >
                          {isActionActive ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Mark as Read"
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark this notification as read</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
});

export default NotificationItem;
