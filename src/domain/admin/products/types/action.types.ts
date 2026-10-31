export type BulkActionType =
  | "approve"
  | "reject"
  | "unlist";

export type ProductFlagType =
  | "featured"
  | "deal"
  | "new";

  export type RejectPayload = {
  rejectionCode?: string;
  rejectionReason?: string;
};