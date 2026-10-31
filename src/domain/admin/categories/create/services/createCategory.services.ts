import axios from "axios";
import type { Category, CategoryFormData } from "../types/category.types";
import { serverFetch } from "@/lib/http";
import { API_BASE_URL } from "@/config/env";

export const fetchAdminCategories = async (
  params?: { status?: string; limit?: number },
  opts?: { signal?: AbortSignal },
): Promise<Category[]> => {
  const status = params?.status;
  const response = await serverFetch<{ categories?: Category[] }>(
    `/api/admin/categories?status=${status}`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );
  return response.categories || [];
};

export const fetchActiveCategories = async (opts?: {
  signal?: AbortSignal;
}): Promise<
  Array<{
    _id: string;
    name: string;
    slug: string;
    parent: string | null;
  }>
> => {
  const response = await serverFetch<{
    categories?: Array<{
      _id: string;
      name: string;
      slug: string;
      parent: string | null;
    }>;
  }>(`/api/admin/categories?status=active`, {
    method: "GET",
    signal: opts?.signal,
  });

  return response.categories || [];
};

export const checkCategorySlug = async (
  slug: string,
  excludeId?: string,
  opts?: { signal?: AbortSignal },
): Promise<boolean> => {
  const response = await serverFetch<{ available: boolean }>(
    `/api/admin/categories/check-slug?slug=${slug}`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );

  return response.available;
};
export const checkCategoryCode = async (
  code: string,
  excludeId?: string,
  opts?: { signal?: AbortSignal },
): Promise<boolean> => {
  const response = await serverFetch<{ available: boolean }>(
    `/api/admin/categories/check-code?code=${code}`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );

  return response.available;
};

export const createCategory = async (
  data: CategoryFormData,
  opts?: { signal?: AbortSignal },
): Promise<{ data: Category; message: string }> => {
  return await serverFetch<{ data: Category; message: string }>(
    "/api/admin/categories",
    {
      method: "POST",
      body: data,
      signal: opts?.signal,
    },
  );
};

export const saveCategoryDraft = async (
  data: Partial<CategoryFormData>,
  opts?: { signal?: AbortSignal },
): Promise<{ id: string; status: string }> => {
  return await serverFetch<{ id: string; status: string }>(
    "/api/admin/categories/draft",
    {
      method: "POST",
      body: data,
      signal: opts?.signal,
    },
  );
};
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return { url: response.data.url };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
