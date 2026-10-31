import { CategoryNode } from "@/domain/home/services/nodeCategories.services";

export function getCategoryUrl(cat: CategoryNode) {
  if (cat.slug) {
    return `/listing/category/${cat.slug}`;
  }
  return `/listing/category/id/${cat._id}`;
}
