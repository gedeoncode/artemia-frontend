import { Images } from "../image.types";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderFilterStatus = OrderStatus | "all";

export type OrderItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images: Images;
};

export type Order = {
  _id: string;
  client: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    notes?: string;
  };
  orderNumber?: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
};

export type OrderFilterParams = {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: "createdAt" | "totalAmount" | "updatedAt";
  order?: "asc" | "desc";
  limit?: number;
  page?: number;
};

export type OrderStats = {
  totalOrders: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
};
export interface OrderResponse {
  order: Order;
  success: boolean;
}