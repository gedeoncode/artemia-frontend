// domain/admin/categories/hooks/useCategories.ts

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCategories } from "../services/category.services";
import {
  CategoryData,
  TypeCategoryFilters,
} from "../services/types";

interface UseCategoriesOptions {
  filters: TypeCategoryFilters;
}

export const useCategories = ({
  filters,
}: UseCategoriesOptions) => {
  return useQuery<CategoryData, AxiosError>({
    queryKey: ["categories", filters],

    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      return getCategories(params);
    },

    placeholderData: (previousData) => previousData,
  });
};