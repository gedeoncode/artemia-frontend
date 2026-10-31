import { clientFetch } from "@/lib/http";
import { RejectPayload } from "../../types";

type ProductFlagType =
  | "featured"
  | "deal"
  | "new";

type BulkAction =
  | "approve"
  | "reject"
  | "unlist";

export const bulkProductActionApi = async (
  action: BulkAction,
  ids: string[],
  reject?: RejectPayload,
): Promise<void> => {
  return clientFetch(
    `/api/admin/products/bulk/${action}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        ids,
        ...(reject ?? {}),
      }),
    },
  );
};

export const toggleProductFlagApi = async (
  id: string,
  flag: ProductFlagType,
): Promise<void> => {
  return clientFetch(
    `/api/admin/products/${id}/flags/${flag}`,
    {
      method: "PATCH",
    },
  );
};