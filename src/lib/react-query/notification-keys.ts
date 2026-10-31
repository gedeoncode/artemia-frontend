// src/query/keys.ts
export const notificationKeys = {
  all: ["notifications"] as const,

  // For regular paginated queries (your older version)
  list: (page: number, limit: number) =>
    [...notificationKeys.all, "list", page, limit] as const,

  // For infinite queries
  infinite: (userId: string) =>
    [...notificationKeys.all, "infinite", userId] as const,
};
