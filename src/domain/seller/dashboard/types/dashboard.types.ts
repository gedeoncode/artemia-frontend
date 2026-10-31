// types/sellerTypes.ts

import { ReactNode } from "react";
import { BaseUser } from "@/types/user.types";
import { ProductSummary } from "@/types/product";

export type SellerStatus = "pending" | "rejected" | "approved";

// =========================
// ENUMS & CONSTANTS
// =========================

export type OrderStatus =
  | "pending"
  | "completed"
  | "cancelled"
  | "processing"
  | "shipped"
  | "delivered";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";
export type ContactMethod = "phone" | "whatsapp" | "email" | "sms";
export type NotificationType =
  | "order"
  | "lead"
  | "inventory"
  | "system"
  | "promotion";
export type ChartInterval = "hourly" | "daily" | "weekly" | "monthly";
export type AlertType = "success" | "warning" | "error" | "info";
export type AlertPriority = "low" | "medium" | "high";
export type InsightType =
  | "positive"
  | "warning"
  | "opportunity"
  | "improvement";

// =========================
// BASE ENTITY TYPES
// =========================

export interface Seller {
  _id: string;
  businessName: string;
  user: BaseUser;
  metrics?: SellerMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface SellerMetrics {
  rating: number;
  totalReviews: number;
  responseTime: number; // in minutes
  fulfillmentRate: number; // percentage
  joinedDate: string;
}

export interface Product extends ProductSummary{
  price: number;
  stock: number;
  isDeleted: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: BaseUser;
  seller: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingCost: number;
  shippingMethod?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  shippedAt?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Lead {
  _id: string;
  customer: BaseUser;
  product: Product;
  seller: string;
  status: LeadStatus;
  contactMethod: ContactMethod;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  convertedAt?: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipients: NotificationRecipient[];
  metadata?: Record<string, any>;
  createdAt: string;
  read: boolean;
}

export interface NotificationRecipient {
  userId: string;
  userType: "Seller" | "Customer" | "Admin";
  read: boolean;
  readAt?: string;
}

export interface Review {
  _id: string;
  user: BaseUser;
  product: Product;
  seller: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// =========================
// DASHBOARD SPECIFIC TYPES
// =========================

export interface DashboardFilters {
  month: number;
  year: number;
  interval: ChartInterval;
  compareWithPrevious: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Alert Types
export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  priority: AlertPriority;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
  data?: Record<string, any>;
}

// Insight Types
export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: AlertPriority;
  action?: {
    label: string;
    link: string;
  };
  metric?: {
    value: number;
    change: number;
    unit: string;
  };
  confidence?: number; // 0-100, how confident AI is in this insight
}

// Chart Data Types
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
  borderDash?: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface RevenueChartData extends ChartData {
  datasets: (ChartDataset & {
    previousRevenue?: number[];
  })[];
}

export interface CategoryPerformance {
  categoryName: string;
  revenue: number;
  quantity: number;
  orderCount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  revenue: number;
  quantity: number;
  orderCount: number;
  conversionRate: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  returningCustomers: number;
  newCustomers: number;
  avgCustomerLTV: number;
}

export interface LeadStats {
  totalLeads: number;
  phoneLeads: number;
  whatsappLeads: number;
  convertedLeads: number;
  conversionRate: number;
  leadSources: Array<{
    _id: string;
    count: number;
  }>;
  topConvertingProducts: Array<{
    productName: string;
    conversions: number;
  }>;
}

export interface LeadStatsResponse extends LeadStats {
  previousConversionRate?: number;
}

export interface PerformanceMetrics {
  conversionRate: number;
  cancellationRate: number;
  revenueGrowth: number;
  orderGrowth: number;
  conversionRateChange: number;
  customerRetention: number;
  avgOrderValue: number;
}

export interface InventoryAlert {
  type: "out_of_stock" | "low_stock" | "high_demand_low_stock";
  count?: number;
  severity: AlertPriority;
  products?: Array<{
    name: string;
    stock: number;
    soldLast30Days?: number;
  }>;
}

export interface DashboardAlerts {
  lowStock: Product[];
  inventory: InventoryAlert[];
  pendingOrders: {
    count: number;
    message: string;
  } | null;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  recentReviews: Array<
    Review & {
      user: BaseUser;
      product: Product;
    }
  >;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ShippingMetrics {
  avgDeliveryDays: number;
  totalShippingCost: number;
  avgShippingCost: number;
  shippingMethods: Array<{
    _id: string;
    count: number;
  }>;
  onTimeDelivery: number; // percentage
}

export interface TimeSeriesDataPoint {
  label: string;
  revenue: number;
  orderCount: number;
  previousRevenue?: number;
}

// =========================
// MAIN DASHBOARD RESPONSE
// =========================

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  totalLeads: number;
  phoneLeads: number;
  whatsappLeads: number;
  convertedLeads: number;
  unreadCount: number;
}

export interface DashboardCharts {
  revenue: RevenueChartData;
  orders: ChartData;
  categoryDistribution: ChartData;
  topProducts: TopProduct[];
  leadConversion: ChartData;
  performanceTrends: {
    revenue: number;
    orders: number;
    conversion: number;
    customerRetention: number;
  };
}

export interface RecentActivities {
  orders: Order[];
  leads: Lead[];
  notifications: Notification[];
}

export interface DashboardMetadata {
  period: {
    start: Date;
    end: Date;
    interval: ChartInterval;
    compareWithPrevious: boolean;
  };
  lastUpdated: Date;
  cacheTTL: number; // in seconds
  responseTime?: number; // in milliseconds
}

export interface DashboardResponse {
  success: boolean;
  seller: Seller;
  stats: DashboardStats;
  performance: PerformanceMetrics;
  charts: DashboardCharts;
  recentActivities: RecentActivities;
  alerts: DashboardAlerts;
  insights: Insight[];
  metadata: DashboardMetadata;
  // Optional fields for extended data
  customerMetrics?: CustomerMetrics;
  reviewStats?: ReviewStats;
  shippingMetrics?: ShippingMetrics;
  leadStats?: LeadStatsResponse;
}
export interface ShellResponse {
  success: boolean;
  data: {
    unReadNotification: number;
  };
}

// =========================
// HOOKS & COMPONENT PROPS
// =========================

export interface UseSellerDataOptions {
  initialData: DashboardResponse;
  filters: DashboardFilters;
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
  onSuccess?: (data: DashboardResponse) => void;
  onError?: (error: Error) => void;
}

export interface UseSellerDataReturn {
  data: DashboardResponse;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
  dataAge: number;
}

export interface UseNavigationOptions {
  sidebarClose: () => void;
  postLogoutRedirect: string;
}

export interface NavigationHook {
  navigateTo: (path: string, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  logout: () => Promise<void>;
}

export interface NavigationOptions {
  replace?: boolean;
  state?: Record<string, any>;
}

// =========================
// API REQUEST/RESPONSE TYPES
// =========================

export interface DashboardQueryParams {
  month?: string;
  year?: string;
  interval?: ChartInterval;
  compareWithPrevious?: string;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  code?: string;
  statusCode?: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

// =========================
// UTILITY TYPES
// =========================

export type SortDirection = "asc" | "desc";

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortDirection;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type MetricCardFormat =
  | "currency"
  | "number"
  | "percentage"
  | "duration";

export interface MetricCard {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  color: string;
  format?: MetricCardFormat;
  onClick?: () => void;
  trend?: "up" | "down" | "stable";
}

// =========================
// HELPER FUNCTIONS & TYPE GUARDS
// =========================

export function isDashboardResponse(data: any): data is DashboardResponse {
  return (
    data &&
    typeof data === "object" &&
    "success" in data &&
    "seller" in data &&
    "stats" in data &&
    "performance" in data &&
    "charts" in data
  );
}

export function isApiErrorResponse(data: any): data is ApiErrorResponse {
  return data && typeof data === "object" && "message" in data;
}

// =========================
// DEFAULT VALUES
// =========================

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  interval: "daily",
  compareWithPrevious: false,
};

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  totalRevenue: 0,
  avgOrderValue: 0,
  conversionRate: 0,
  totalLeads: 0,
  phoneLeads: 0,
  whatsappLeads: 0,
  convertedLeads: 0,
  unreadCount: 0,
};

export const DEFAULT_PERFORMANCE_METRICS: PerformanceMetrics = {
  conversionRate: 0,
  cancellationRate: 0,
  revenueGrowth: 0,
  orderGrowth: 0,
  conversionRateChange: 0,
  customerRetention: 0,
  avgOrderValue: 0,
};

// =========================
// EXPORT ALL TYPES
// =========================

export type {
  OrderStatus as OrderStatusType,
  LeadStatus as LeadStatusType,
  ContactMethod as ContactMethodType,
  NotificationType as NotificationTypeType,
};
