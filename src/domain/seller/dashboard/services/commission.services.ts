import { serverFetch } from "@/lib/http";
import { CommissionModel } from "@/types/seller";
import { updateCommissionModelResponse } from "../types/commission.types";

export const updateCommissionModel = async (
  model: CommissionModel,
): Promise<updateCommissionModelResponse> => {
  return serverFetch<updateCommissionModelResponse>(
    "/api/seller/change-commission-model",
    {
      method: "PATCH",
      requireAuth: true,
      body: {model},
    },
  );
};