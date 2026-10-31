import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/EmptyState";
import { CheckCircle2, Filter, Archive } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationItem from "./NotificationItem";
import { useNotificationList } from "../hooks/useNotificationList";
import { LoadingDots } from "@/components/ui/LoadingSpinner";
import { UseNotificationListParams } from "../../dashboard/types/notificationTypes";

export function NotificationList(props: UseNotificationListParams) {
  const {
    filter,
    setFilter,

    filteredNotifications,
    pagination,
    loading,
    error,
    isFetchingNextPage,
    markOneLoading,
    activeActionId,

    markOne,
    loadMoreRef,
  } = useNotificationList(props);

  const unreadCountLabel =
    pagination.unreadCount > 999 ? "999+" : pagination.unreadCount;

  return (
    <section
      className="flex flex-col w-full"
      aria-label="Notifications"
      role="region"
    >
      <Tabs value={filter} onValueChange={(v) => setFilter(v)}>
        {/* HEADER */}
        <header className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Archive aria-hidden="true" className="w-4 h-4" />
              <span>All</span>
            </TabsTrigger>

            <TabsTrigger
              value="unread"
              className="relative flex items-center gap-2"
            >
              <Filter aria-hidden="true" className="w-4 h-4" />
              <span>Unread</span>

              {pagination.unreadCount > 0 && (
                <span
                  className="ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-600 text-white"
                  aria-label={`${pagination.unreadCount} unread notifications`}
                >
                  {unreadCountLabel}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </header>

        {/* CONTENT */}
        <TabsContent
          value={filter}
          className="space-y-4 focus-visible:outline-none"
        >
          {/* ERROR STATE */}
          {error && (
            <EmptyState
              icon={Archive}
              title="Couldn’t load notifications"
              description={error}
            />
          )}

          {/* EMPTY STATE */}
          {!loading && filteredNotifications.length === 0 && !error && (
            <EmptyState
              icon={filter === "unread" ? CheckCircle2 : Archive}
              title={
                filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"
              }
              description={
                filter === "unread"
                  ? "You’re all caught up!"
                  : "Notifications will appear here when you receive them."
              }
            />
          )}

          {/* LIST */}
          {!loading && filteredNotifications.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
                {filteredNotifications.map((n, index) => (
                  <motion.div
                    key={n._id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.14, delay: index * 0.01 }}
                  >
                    <NotificationItem
                      notification={n}
                      userId={props.userId}
                      onMarkRead={markOne}
                      isActionActive={activeActionId === n._id}
                      isUpdating={markOneLoading && activeActionId === n._id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* PAGINATION LOADER */}
              <div ref={loadMoreRef} className="centered-container">
                {isFetchingNextPage && <LoadingDots />}
              </div>
            </div>
          )}

          <div aria-live="polite" className="sr-only">
            {pagination.unreadCount > 0
              ? `${pagination.unreadCount} unread notifications`
              : "No unread notifications"}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
