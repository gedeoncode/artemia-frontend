// src/query/mutations/useMarkNotificationRead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/lib/react-query/notification-keys";
import { markNotificationRead } from "../services/notificationServices";
  
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => markNotificationRead(id),

    onSuccess: (_, id) => {
      // Update all notification lists in cache
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },

    // Optional: instant UI
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previous = queryClient.getQueryData(notificationKeys.all);

      queryClient.setQueryData(notificationKeys.all, (old: any) => {
        if (!old) return old;

        return old.map((n: any) =>
          n._id === id
            ? {
                ...n,
                recipients: n.recipients.map((r: any) => ({
                  ...r,
                  read: true,
                })),
              }
            : n
        );
      });
      return { previous };
    },

    onError: (_, __, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(notificationKeys.all, ctx.previous);
      }
    },
  });
}
