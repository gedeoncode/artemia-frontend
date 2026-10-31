// app/seller/products/types/sort.types.ts
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentSort: SortConfig;
  onSort: (field: string) => void;
  disabled?: boolean;
}
export const PRODUCT_DISPLAY_STATUSES = [
  "active",
  "draft",
  "pending_review",
  "rejected",
  "suspended",
  "archived",
  "out_of_stock",
  "payment_required",
] as const;


export const PRODUCT_DISPLAY_STATUS_LABELS: Record<
  (typeof PRODUCT_DISPLAY_STATUSES)[number],
  string
> = {
  active: "Active",
  draft: "Draft",
  pending_review: "Pending Review",
  rejected: "Rejected",
  suspended: "Suspended",
  archived: "Archived",
  out_of_stock: "Out of Stock",
  payment_required: "Payment Required",
};

export type ProductDisplayStatus = (typeof PRODUCT_DISPLAY_STATUSES)[number];
export const SORT_FIELDS = [ "createdAt" , "name" , "stock" , "sales" ,"price"] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export interface ProductFilterParams {
  status?: ProductDisplayStatus;

  category?: string;

  search?: string;

  sort?:SortField;

  order?: SortOrder;

  page?: number;

  limit?: number;
  all?: string;
}
export type BulkAction = "restore" | "archived" | "delete";
export type BulkActionParams = {
  productIds: string[];
  action: BulkAction
};