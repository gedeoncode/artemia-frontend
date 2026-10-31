"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import { updateSellerStatus } from "../services/manage.sellers.services";

import { sellerKeys } from "@/lib/react-query/seller-keys";

import { getErrorMessage } from "@/errors/errorMessage";
import { Seller } from "../services/types";


interface UpdateSellerStatusPayload {
  sellerId: string;

  status: "approved" | "rejected";
}

export function useSellerStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sellerId,
      status,
    }: UpdateSellerStatusPayload) => {
      return updateSellerStatus(
        sellerId,
        status
      );
    },

    // =========================================
    // Optimistic Update
    // =========================================
    onMutate: async variables => {
      const { sellerId, status } =
        variables;

      // Stop outgoing refetches
      await queryClient.cancelQueries({
        queryKey: sellerKeys.all,
      });

      // Snapshot previous cache
      const previousQueries =
        queryClient.getQueriesData({
          queryKey: sellerKeys.all,
        });

      // Update all seller caches
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
                        status,
                      }
                    : seller
              ),
            }
          );
        }
      );

      // Return rollback context
      return { previousQueries };
    },

    // =========================================
    // Rollback if failed
    // =========================================
    onError: (
      error,
      variables,
      context
    ) => {
      toast.error(
        `Failed to ${variables.status} seller: ${getErrorMessage(
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
        `Seller ${variables.status} successfully`
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