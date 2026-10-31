
export const productKeys = {
  all: ["products"] as const,

  // =========================
  // PUBLIC KEYS
  // =========================

  // LISTS
  lists: () => [...productKeys.all, "list"] as const,

  list: (params: unknown) =>
    [...productKeys.lists(), params] as const,

  // DETAILS
  details: () => [...productKeys.all, "detail"] as const,

  detail: (id: string) => [...productKeys.details(), id] as const,

  // REVIEWS
  reviews: (productId: string) =>
    [...productKeys.detail(productId), "reviews"] as const,

  // RELATED PRODUCTS
  related: (productId: string) =>
    [...productKeys.detail(productId), "related"] as const,

  // RECENTLY VIEWED
  recentlyViewed: (ids: string[]) =>
    [...productKeys.all, "recently-viewed", { ids }] as const,

  // =========================
  // ADMIN KEYS
  // =========================

  admin: () => [...productKeys.all, "admin"] as const,

  // ADMIN LISTS
  adminLists: () => [...productKeys.admin(), "list"] as const,

  adminList: (params: unknown) =>
    [...productKeys.adminLists(), params] as const,

  // ADMIN DETAILS
  adminDetails: () => [...productKeys.admin(), "detail"] as const,

  adminDetail: (id: string) =>
    [...productKeys.adminDetails(), id] as const,

  // ADMIN ANALYTICS / STATS
  adminStats: () => [...productKeys.admin(), "stats"] as const,

  // ADMIN INVENTORY
  adminInventory: () =>
    [...productKeys.admin(), "inventory"] as const,

  adminInventoryItem: (id: string) =>
    [...productKeys.adminInventory(), id] as const,
};