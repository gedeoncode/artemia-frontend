"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import {
  blockSeller,
  unblockSeller,
} from "../services/manage.sellers.services";

import { sellerKeys } from "@/lib/react-query/seller-keys";

import { getErrorMessage } from "@/errors/errorMessage";

import { Seller } from "../services/types";

interface SellerBlockPayload {
  sellerId: string;

  action: "block" | "unblock";
}

export function useSellerBlockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sellerId,
      action,
    }: SellerBlockPayload) => {
      if (action === "block") {
        return blockSeller(sellerId);
      }

      return unblockSeller(sellerId);
    },

    // =========================================
    // Optimistic Update
    // =========================================
    onMutate: async variables => {
      const { sellerId, action } =
        variables;

      // Cancel ongoing refetches
      await queryClient.cancelQueries({
        queryKey: sellerKeys.all,
      });

      // Snapshot previous cache
      const previousQueries =
        queryClient.getQueriesData({
          queryKey: sellerKeys.all,
        });

      // Update every sellers cache
      previousQueries.forEach(
        ([queryKey, data]: any) => {
          if (!data?.sellers) return;

          queryClient.setQueryData(
            queryKey,
            {
              ...data,

              sellers: data.sellers.map(
                (seller: Seller) =>
                  seller._id === sellerId
                    ? {
                        ...seller,

                        isBlocked:
                          action ===
                          "block",
                      }
                    : seller
              ),
            }
          );
        }
      );

      return { previousQueries };
    },

    // =========================================
    // Rollback
    // =========================================
    onError: (
      error,
      variables,
      context
    ) => {
      toast.error(
        `Failed to ${variables.action} seller: ${getErrorMessage(
          error
        )}`
      );

      // Restore previous cache
      context?.previousQueries?.forEach(
        ([queryKey, data]: any) => {
          queryClient.setQueryData(
            queryKey,
            data
          );
        }
      );
    },

    // =========================================
    // Success
    // =========================================
    onSuccess: (_, variables) => {
      toast.success(
        `Seller ${variables.action}ed successfully`
      );
    },

    // =========================================
    // Sync with server
    // =========================================
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: sellerKeys.all,
      });
    },
  });
}