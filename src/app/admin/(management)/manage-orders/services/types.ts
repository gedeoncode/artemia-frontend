// types.ts or inside the component file
export interface Order {
  _id: string;
  orderId: string;
  buyer: { name: string; email: string };
  totalPrice: number;
  createdAt: string;
  handledBy: HandleBy;
  client: {
    name: string;
  };
  // add more fields as needed
  status: OrderStatus;
  items: OrderItem[];
}

export interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder?: (orderId: string) => void; // optional callback
  onStatusChange?: (orderId: string, newStatus: string) => void; // optional
}
 type HandleBy = "platform" | "seller";
export type OrderSearchParams = {

  handledBy:HandleBy;
  search:string;
  page?: string;
  limit?: string;
  status?: OrderStatus;
  customer?: string;
  start_date?: string;
  end_date?: string;
  sort?: OrderSortField;

};

export interface AdminOrdersPageProps {
  /** URL search parameters parsed from query string */
  searchParams: OrderSearchParams;
  params?: {
    locale?: string;
  };
}

// Additional supporting types
export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "completed" 
  | "cancelled" 
  | "refunded";

export type OrderSortField =
  | "createdAt:asc"
  | "createdAt:desc"
  | "total:asc"
  | "total:desc";
export type SortDirection = "asc" | "desc";

// Type for the API response
export interface OrdersResponse {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

// Base Order type (adjust fields as needed)


interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}