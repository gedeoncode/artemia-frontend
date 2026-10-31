// Central place for query keys
export const DASHBOARD_QUERY_KEY = ["seller", "dashboard"] as const;
export const sellerKeys = {
  all: ["sellers"] as const,

  lists: () =>
    [...sellerKeys.all, "list"] as const,

  list: (params: unknown) =>
    [...sellerKeys.lists(), params] as const,
};