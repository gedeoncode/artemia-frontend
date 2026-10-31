export const CATEGORY_STATUSES = [
  "active",
  "inactive",
  "archived",
 
] as const;

export type CategoryStatus = (typeof CATEGORY_STATUSES)[number];

export const CATEGORY_STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    description: "Visible in store",
    dotClassName: "h-2 w-2 rounded-full bg-green-500",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Hidden from customers",
    dotClassName: "h-2 w-2 rounded-full bg-gray-500",
  },
  {
    value: "archived",
    label: "Archived",
    description: "Work in progress",
    dotClassName: "h-2 w-2 rounded-full bg-yellow-500",
  },
] as const;