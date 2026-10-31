

// useNotificationList.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { UseNotificationListParams } from "../../types/notificationTypes";
export function useNotificationList({
  notifications,
  filteredNotifications,
  loading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  markOne,

  markOneLoading,

  refetch,
  activeActionId,
  filter: initialFilter,
  setFilter: externalSetFilter,
  userId,
  pagination,
  error,
}: UseNotificationListParams) {
  const [filter, setFilter] = useState(initialFilter || "all");

  const loadMoreRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting) return;
      if (!hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "400px",
      threshold: 0.01,
    });

    observer.observe(el);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [filteredNotifications.length, filter, handleIntersection]);

  useEffect(() => {
    if (filter !== "unread") return;

    const missingUnread = pagination.unreadCount > filteredNotifications.length;
    if (missingUnread && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    filter,
    pagination.unreadCount,
    filteredNotifications.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const setFilterSafe = (v) => {
    setFilter(v);
    if (externalSetFilter) externalSetFilter(v);
  };

  return {
    filter,
    setFilter: setFilterSafe,
    notifications,
    filteredNotifications,
    pagination,
    loading,
    error,
    isFetchingNextPage,
    hasNextPage,
    markOneLoading,
    activeActionId,
    markOne,
    loadMoreRef,
    userId,
    refetch,
  };
}

