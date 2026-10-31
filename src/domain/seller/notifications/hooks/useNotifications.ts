import { useMemo, useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";
import { notificationKeys } from "@/lib/react-query/notification-keys";
import {
  markNotificationRead,
  markAllNotificationsRead,
  fetchNotifications,
} from "@/domain/seller/dashboard/services/notificationServices";

const ITEMS_PER_PAGE = 10;
export function useNotifications(userId: string) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------
  // Infinite query
  // ---------------------------------------------------------------------

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage, 
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: notificationKeys.infinite(userId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchNotifications(pageParam, ITEMS_PER_PAGE),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 15 * 1000, // enterprise: avoid cascading refetch spam
    gcTime: 30 * 60 * 1000,
  });

  // ---------------------------------------------------------------------
  // Flatten notifications
  // ---------------------------------------------------------------------
  const allNotificationsRaw = useMemo(() => {
    return data?.pages?.flatMap((p) => p.data ?? []) ?? [];
  }, [data?.pages]);

  // ---------------------------------------------------------------------
  // Attach derived fields (enterprise rule: state normalization)
  // ---------------------------------------------------------------------
  const allNotifications = useMemo(() => {
    return allNotificationsRaw.map((n) => {
      const me = n.recipients?.find((r) => r.userId === userId);
      return { ...n, isRead: me?.read === true };
    });
  }, [allNotificationsRaw, userId]);

  const unreadNotifications = useMemo(
    () => allNotifications.filter((n) => !n.isRead),
    [allNotifications],
  );

  const filteredNotifications =
    filter === "all" ? allNotifications : unreadNotifications;

  // ---------------------------------------------------------------------
  // Pagination summary
  // ---------------------------------------------------------------------
  const firstPage = data?.pages?.[0];

  const pagination = {
    totalPages: firstPage?.totalPages ?? 1,
    totalCount: firstPage?.totalCount ?? 0,
    unreadCount: unreadNotifications.length,
  };

  // ---------------------------------------------------------------------
  // Auto-fetch MORE pages when switching to "unread"
  // Critical for unread mode to preload pages (pairs with UI fix)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (filter !== "unread") return;

    const missingUnread = pagination.unreadCount > unreadNotifications.length;

    if (missingUnread && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    filter,
    pagination.unreadCount,
    unreadNotifications.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // ---------------------------------------------------------------------
  // MUTATION: Mark ONE notification read (optimistic + rollback)
  // ---------------------------------------------------------------------
  const markOneMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries(notificationKeys.infinite(userId));

      const previous = queryClient.getQueryData(
        notificationKeys.infinite(userId),
      );

      queryClient.setQueryData(
        notificationKeys.infinite(userId),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, i) => {
              const updatedPage = {
                ...page,
                data: page.data.map((n) =>
                  n._id === id
                    ? {
                        ...n,
                        recipients: n.recipients.map((r) =>
                          r.userId === userId ? { ...r, read: true } : r,
                        ),
                      }
                    : n,
                ),
              };

              // Adjust unreadCount on first page
              if (i === 0) {
                updatedPage.unreadCount = Math.max(
                  0,
                  (updatedPage.unreadCount ?? 0) - 1,
                );
              }

              return updatedPage;
            }),
          };
        },
      );

      return { previous };
    },

    onError: (_, __, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          notificationKeys.infinite(userId),
          ctx.previous,
        );
      }
      toast.error("Failed to mark notification.");
    },

    onSuccess: () => {
      toast.success("Notification marked as read.");
    },

    onSettled: () => {
      // Do not force immediate refetch (no flicker),
      // but request background sync.
      queryClient.invalidateQueries(notificationKeys.infinite(userId), {
        refetchType: "none",
      });
    },
  });

  // ---------------------------------------------------------------------
  // MUTATION: Mark ALL notifications read (optimistic)
  // ---------------------------------------------------------------------
  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(userId),

    onMutate: async () => {
      await queryClient.cancelQueries(notificationKeys.infinite(userId));

      const previous = queryClient.getQueryData(
        notificationKeys.infinite(userId),
      );

      queryClient.setQueryData(
        notificationKeys.infinite(userId),
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page, i) => {
              const updatedPage = {
                ...page,
                data: page.data.map((n) => ({
                  ...n,
                  recipients: n.recipients.map((r) =>
                    r.userId === userId ? { ...r, read: true } : r,
                  ),
                })),
              };

              if (i === 0) {
                updatedPage.unreadCount = 0;
              }

              return updatedPage;
            }),
          };
        },
      );

      return { previous };
    },

    onError: (_, __, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          notificationKeys.infinite(userId),
          ctx.previous,
        );
      }
      toast.error("Failed to mark all notifications.");
    },

    onSuccess: () => {
      toast.success("All notifications marked as read.");
    },

    onSettled: () => {
      queryClient.invalidateQueries(notificationKeys.infinite(userId), {
        refetchType: "none",
      });
    },
  });

  return {
    // Lists
    notifications: allNotifications,
    filteredNotifications,
    pagination,

    // Query state
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,


    // Pagination actions
    fetchNextPage,

    // Filter state
    filter,
    setFilter,

    // Mutations
    markOne: markOneMutation.mutate,
    markAll: markAllMutation.mutate,
    markOneLoading: markOneMutation.isPending,
    markAllLoading: markAllMutation.isPending,
  };
}
