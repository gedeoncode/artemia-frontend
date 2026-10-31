// app/seller/dashboard/manage-products/types/manage-products.types.ts
import type { Product, ProductFilterParams } from "@/domain/seller/products/types/product.types";



export interface ManageProductsInitialData {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface BulkActionParams {
  action: 'delete' | 'archive' | 'updateStatus';
  productIds: string[];
  payload?: unknown;
}

export type BulkActionResult = {
  success: boolean;
  message: string;
  failedIds?: string[];
};