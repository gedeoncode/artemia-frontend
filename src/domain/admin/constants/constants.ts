// constants/orderFilters.ts
export const ORDER_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export const HANDLED_BY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Platform", value: "platform" },
  { label: "Seller", value: "seller" },
];

export const DEFAULT_FILTER_VALUE = {
  status: "all",
  handledBy: "all",
  search: "",
  sort: "newest", // optional, 
  page: 1,
  limit: 10,
};
// constants/pagination.ts
export const DEFAULT_PAGE_SIZE = 10;
