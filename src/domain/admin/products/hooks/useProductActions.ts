// domain/admin/products/hooks/useProductActions.ts

"use client";

import { toast } from "react-toastify";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bulkProductActionApi, toggleProductFlagApi } from "../services/client";

import { BulkActionType, ProductFlagType, RejectPayload } from "../types";
import { productKeys } from "@/lib/react-query/product-keys";

type UseProductActionsProps = {
  onClearSelection?: () => void;
};

const ACTION_MESSAGES: Record<BulkActionType, string> = {
  approve: "approved",
  reject: "rejected",
  unlist: "unlisted",
};

export function useProductActions({
  onClearSelection,
}: UseProductActionsProps = {}) {
  const queryClient = useQueryClient();

  // =========================
  // Invalidate products query
  // =========================
  const invalidateProducts = async () => {
    await queryClient.invalidateQueries({
      queryKey: productKeys.adminLists(),
    });
  };

  // =========================
  // Bulk mutation
  // =========================
  const bulkMutation = useMutation({
    mutationFn: async ({
      action,
      ids,
      reject,
    }: {
      action: BulkActionType;
      ids: string[];
      reject?: RejectPayload;
    }) => {
      return bulkProductActionApi(action, ids, {
        rejectionCode: reject?.rejectionCode,
        rejectionReason: reject?.rejectionReason,
      });
    },

    onSuccess: async (_, variables) => {
      toast.success(
        `Products ${ACTION_MESSAGES[variables.action]} successfully`,
      );

      onClearSelection?.();

      await invalidateProducts();

      // Optional: invalidate affected product details
      await Promise.all(
        variables.ids.map((id) =>
          queryClient.invalidateQueries({
            queryKey: productKeys.adminDetail(id),
          }),
        ),
      );
    },

    onError: (err, variables) => {
      console.error(`Bulk ${variables.action} error:`, err);

      toast.error(
        err instanceof Error ? err.message : `Bulk ${variables.action} failed`,
      );
    },
  });

  // =========================
  // Product flag mutation
  // =========================
  const flagMutation = useMutation({
    mutationFn: async ({ id, flag }: { id: string; flag: ProductFlagType }) => {
      return toggleProductFlagApi(id, flag);
    },

    onSuccess: async (_, variables) => {
      toast.success(`Product ${variables.flag} status updated`);

      await invalidateProducts();

      await queryClient.invalidateQueries({
        queryKey: productKeys.adminDetail(variables.id),
      });
    },

    onError: (err, variables) => {
      console.error(`Toggle ${variables.flag} error:`, err);

      toast.error(
        err instanceof Error
          ? err.message
          : `Failed to toggle ${variables.flag}`,
      );
    },
  });

  // =========================
  // Public API
  // =========================

  const handleBulkAction = async (
    action: BulkActionType,
    ids: string[],
    reject?: RejectPayload,
  ) => {
    console.log("action:", action);
    return bulkMutation.mutateAsync({
      action,
      ids,
      reject:
        action === "reject" && reject
          ? {
              rejectionCode: reject.rejectionCode,
              rejectionReason: reject.rejectionReason,
            }
          : undefined,
    });
  };

  const handleSingleAction = async (
    action: BulkActionType,
    id: string,
    reject?: RejectPayload,
  ) => {
    return bulkMutation.mutateAsync({
      action,
      ids: [id],
      reject:
        action === "reject" && reject
          ? {
              rejectionCode: reject.rejectionCode,
              rejectionReason: reject.rejectionReason,
            }
          : undefined,
    });
  };

  const handleToggleProductFlag = async (id: string, flag: ProductFlagType) => {
    return flagMutation.mutateAsync({
      id,
      flag,
    });
  };

  return {
    handleBulkAction,
    handleSingleAction,

    toggleProductFlag: handleToggleProductFlag,

    isBulkActionPending: bulkMutation.isPending,

    isToggleFlagPending: flagMutation.isPending,

    isPending: bulkMutation.isPending || flagMutation.isPending,
  };
}
