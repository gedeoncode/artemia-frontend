export type CategoryListParams = {
  parentId?: string | null;
  includeChildren?: boolean;
  depth?: number; // useful for tree fetching
};

export const categoryKeys = {
  // Root namespace
  all: ["categories"] as const,

  // LISTS (collections)
  lists: () => [...categoryKeys.all, "list"] as const,

  list: (params?: unknown) =>
    [...categoryKeys.lists(), params ?? {}] as const,

  // TREE STRUCTURES (very common in marketplaces)
  trees: () => [...categoryKeys.all, "tree"] as const,

  tree: (params?: { rootId?: string; depth?: number }) =>
    [...categoryKeys.trees(), params ?? {}] as const,

  // DETAILS (single category)
  details: () => [...categoryKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...categoryKeys.details(), id] as const,

  // CHILDREN (explicit separation for performance)
  children: (parentId: string) =>
    [...categoryKeys.all, "children", parentId] as const,

  // ANCESTORS / BREADCRUMBS
  ancestors: (id: string) =>
    [...categoryKeys.all, "ancestors", id] as const,

  // SEARCH (admin / dynamic filtering)
  search: (query: string) =>
    [...categoryKeys.all, "search", { query }] as const,
};