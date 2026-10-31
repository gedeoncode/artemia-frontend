import { clientFetch } from "@/lib/http";
import type { Category, CategoryFormData } from "../../types/category.types";
export const fetchAdminCategoriesApi = async (params?: {
  status?: string;
  limit?: number;
}): Promise<{ categories: Category[] }> => {
  const searchParams = new URLSearchParams();

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return clientFetch(`/api/admin/categories${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

export const fetchActiveCategoriesApi = async (): Promise<{
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    parent: string | null;
  }>;
}> => {
  return clientFetch("/api/admin/categories?status=active", {
    method: "GET",
  });
};

export const checkCategorySlugApi = async (
  slug: string,
  excludeId?: string,
): Promise<{ available: boolean }> => {
  const searchParams = new URLSearchParams({
    slug,
  });

  if (excludeId) {
    searchParams.set("excludeId", excludeId);
  }

  return clientFetch(
    `/api/admin/categories/check-slug?${searchParams.toString()}`,
    {
      method: "GET",
    },
  );
};
export const checkCategoryCodeApi = async (
  code: string,
  excludeId?: string,
): Promise<{ available: boolean }> => {
  const searchParams = new URLSearchParams({
    code,
  });

  if (excludeId) {
    searchParams.set("excludeId", excludeId);
  }

  return clientFetch(
    `/api/admin/categories/check-code?${searchParams.toString()}`,
    {
      method: "GET",
    },
  );
};

export const createCategoryApi = async (
  data: CategoryFormData,
): Promise<{ data: Category; message: string }> => {
  return clientFetch("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const saveCategoryDraftApi = async (
  data: Partial<CategoryFormData>,
): Promise<{ id: string; status: string }> => {
  return clientFetch("/api/admin/categories/draft", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
