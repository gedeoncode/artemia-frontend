import { apiFetch } from "@/lib/fetchLayers/apiFetch"; // adjust path
import { notFound } from "next/navigation";
import { Category, CategoryData } from "./types"; // adjust to actual type location
const API_BASE = "/api/admin/categories/";

export const getCategories = async (
  params: URLSearchParams,
): Promise<CategoryData> => {
  try {
    // Convert URLSearchParams to a query string
    const queryString = params.toString();
    const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;

    return await apiFetch<CategoryData>(url, { requireAuth: true });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    notFound();
  }
};

export const getCategory = async (id: string): Promise<Category> => {
  try {
    return await apiFetch<Category>(`/api/admin/categories/${id}`, {
      next: { tags: [`category-${id}`] }, // ISR revalidation tag
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 404
    ) {
      notFound(); // Next.js 13/14 app router
    }

    console.error("Failed to fetch category:", error);
    throw new Error("An unexpected error occurred while fetching category.");
  }
};

// deleteCategory can be implemented similarly when needed
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiFetch<void>(`/api/admin/categories/${id}`, {
      method: "DELETE",
      requireAuth: true,
    });
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw new Error("An unexpected error occurred while deleting category.");
  }
};
