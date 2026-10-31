import { Seller } from "../services/types";

export type SellerStatus =
  | "all"
  | "approved"
  | "pending"
  | "rejected"
  | "blocked";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SellersResponse {
  data: Seller[];
  pagination: PaginationMeta;
}

export interface SellersQueryParams {
  page: number;
  searchTerm: string;
  statusFilter: SellerStatus;
}