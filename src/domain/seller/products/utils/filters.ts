// utils/filters.ts

import { ProductFilterParams } from "../types/filter.types";

export const hasActiveProductFilters = (
  params: ProductFilterParams,
) => {
  return (
    Boolean(params.search) ||
    Boolean(params.category) ||
    Boolean(params.status) ||
    Boolean(params.sort) 
    // Boolean(params.page)
  );
}