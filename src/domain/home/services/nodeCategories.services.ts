
import { serverFetch, ServerFetchOptions } from "@/lib/http";
export type CategoryNode = {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  hasChildren: boolean;
};
export interface CategoryData {
  data: CategoryNode[];
};

export const fetchNodeCategories = async (
  parentId?: string | null,
  options?: ServerFetchOptions,
): Promise<CategoryData> => {
  const url =`/api/categories/node?parentId=${parentId}`;
  return await serverFetch<CategoryData>(url, {
    method: "GET",
    requireAuth: false,
    ...options,
  });
};
