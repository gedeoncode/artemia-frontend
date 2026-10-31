

import { serverFetch } from "@/lib/http";
import { SellerResponse } from "@/types/seller/seller.types";

export const getSellerProfile = async (opts?: {
  signal?: AbortSignal;
}): Promise<SellerResponse> => {
  return serverFetch("/api/seller/profile", {
    method: "GET",
    signal: opts?.signal,
  });
};