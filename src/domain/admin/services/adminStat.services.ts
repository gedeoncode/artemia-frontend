import { serverFetch } from "@/lib/http";
import {
  AdminDashboardResponse,
 
} from "@/domain/admin/types/adminDashboard.types";
import { normalizeAdminDashboard } from "../adapters/adminDashboard.adater";


export const fetchAdminDashboard = async (opts?: {
  signal?: AbortSignal;
}): Promise<AdminDashboardResponse> => {
  const response = await serverFetch<AdminDashboardResponse>(
    "/api/admin/dashboard",
    {
      method: "GET",
      signal: opts?.signal,
    }
  );
  return normalizeAdminDashboard(response);
};