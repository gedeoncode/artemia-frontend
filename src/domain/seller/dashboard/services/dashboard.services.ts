import { serverFetch } from "@/lib/http";
import { DashboardResponse, ShellResponse } from "../types/commission.types";

export const getSellerDashboard = async (opts?: {
  signal?: AbortSignal;
  params?: {
    month?: number;
    year?: number;
    interval?: "hourly" | "daily" | "weekly" | "monthly";
    compareWithPrevious?: boolean;
  };
}): Promise<DashboardResponse> => {
  const searchParams = new URLSearchParams();

  if (opts?.params) {
    if (opts.params.month)
      searchParams.set("month", opts.params.month.toString());
    if (opts.params.year) searchParams.set("year", opts.params.year.toString());
    if (opts.params.interval)
      searchParams.set("interval", opts.params.interval);
    if (opts.params.compareWithPrevious)
      searchParams.set("compareWithPrevious", "true");
  }

  const queryString = searchParams.toString();
  const url = `/api/seller/dashboard${queryString ? `?${queryString}` : ""}`;

  return serverFetch(url, {
    method: "GET",
    signal: opts?.signal,
  });
};
export const getSellerShell = async (): Promise<ShellResponse> => {
  return serverFetch(`/api/seller/shell`, {
    method: "GET",
  });
};
