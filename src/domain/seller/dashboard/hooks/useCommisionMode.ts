"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { CommissionModel } from "@/types/seller";
import { updateCommissionModelAction } from "../actions";
import { invalidateUser } from "@/domain/auth/lib";

export function useCommissionModel() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (model: CommissionModel) => {
      return await updateCommissionModelAction(model);
    },

    onSuccess: () => invalidateUser(queryClient)

  });

  return {
    commissionModel: user?.commissionModel ?? "PAP",
    updateCommissionModel: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}
