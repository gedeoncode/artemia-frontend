import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import  {
  getReviews,
  createReviewApi,
  updateReviewApi,
  deleteReviewApi,
} from "../../services/client";

/**
 * GET reviews
 */
export function useReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await getReviews(productId);
      return res.data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * CREATE review
 */
export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewApi,

    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", productId] });

      const previous = queryClient.getQueryData(["reviews", productId]);

      queryClient.setQueryData(["reviews", productId], (old: any[] = []) => [
        {
          id: "temp-id",
          ...newReview,
          createdAt: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previous };
    },

    onError: (_err, _newReview, context) => {
      queryClient.setQueryData(["reviews", productId], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
}

/**
 * UPDATE review
 */
export function useUpdateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: { rating?: number; comment?: string };
    }) => updateReviewApi(reviewId, data),

    onMutate: async ({ reviewId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", productId] });

      const previous = queryClient.getQueryData(["reviews", productId]);

      queryClient.setQueryData(["reviews", productId], (old: any[] = []) =>
        old.map((r) =>
          r.id === reviewId
            ? { ...r, ...data, updatedAt: new Date().toISOString() }
            : r
        )
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["reviews", productId], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
}

/**
 * DELETE review
 */
export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReviewApi(reviewId),

    onMutate: async (reviewId: string) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", productId] });

      const previous = queryClient.getQueryData(["reviews", productId]);

      queryClient.setQueryData(["reviews", productId], (old: any[] = []) => {
        if (!Array.isArray(old)) return old;
        return old.filter((r) => r.id !== reviewId);
      });

      return { previous };
    },

    onError: (_err, _reviewId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["reviews", productId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
}