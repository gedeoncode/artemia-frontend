
export const leadKeys = {
  all: ["leads"] as const,

  // =========================
  // PUBLIC KEYS
  // =========================

  // LISTS
  lists: () => [...leadKeys.all, "list"] as const,

  list: (params: unknown) =>
    [...leadKeys.lists(), params] as const,

  // DETAILS
  details: () => [...leadKeys.all, "detail"] as const,

  detail: (id: string) => [...leadKeys.details(), id] as const,

};