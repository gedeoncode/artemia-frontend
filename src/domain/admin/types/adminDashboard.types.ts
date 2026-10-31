// domain/admin/types/adminDashboard.types.ts

export interface RevenueDataPoint {
  month: string;
  sellerRevenue: number;
  platformRevenue: number;
  totalRevenue: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  totals: {
    users: number;
    sellers: number;
    orders: number;
    products: number;
    categories: number;
    activePromotions: number;
    unreadNotifications: number;
  };
  revenue: {
    platform: number;
    seller: number;
    total: number;
    monthlyData: RevenueDataPoint[];
    monthlyGrowth: number;
  };
  products: {
    topSelling: Array<{
      _id: string;
      name: string;
      salesCount: number;
      images: string[];
      price: number;
      stock: number;
    }>;
    lowStockCount: number;
  };
  users: {
    newLast7Days: number;
    activeLast30Days: number;
    total: number;
  };
  sellers: {
    topPerformers: Array<{
      _id: string;
      businessName: string;
      totalSales: number;
      rating: number;
      logo?: string | null;
    }>;
    pendingApplications: number;
    total: number;
  };
  recentOrders: Array<{
    id: string;
    user: string;
    amount: number;
    status: string;
    items: number;
    date: Date;
  }>;
  notifications: {
    recent: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      read: boolean;
      sender: string;
      date: Date;
    }>;
    unreadCount: number;
  };
  systemHealth?: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    nodeVersion: string;
    environment: string;
  };
}