"use server"
import { CommissionModel } from "@/types/seller";
import { updateCommissionModel } from "../services/commission.services";

export async function updateCommissionModelAction(model: CommissionModel) {
  return updateCommissionModel(model);
}
