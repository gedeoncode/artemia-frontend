// domain/admin/adapters/adminDashboard.adapter.ts

import { 
  AdminDashboardResponse, 
  RevenueDataPoint 
} from "../types/adminDashboard.types";

export function normalizeAdminDashboard(
  data: Partial<AdminDashboardResponse> | null | undefined
): AdminDashboardResponse {
  return {
    totals: {
      users: data?.totals?.users ?? 0,
      sellers: data?.totals?.sellers ?? 0,
      orders: data?.totals?.orders ?? 0,
      products: data?.totals?.products ?? 0,
      categories: data?.totals?.categories ?? 0,
      activePromotions: data?.totals?.activePromotions ?? 0,
      unreadNotifications: data?.totals?.unreadNotifications ?? 0,
    },

    revenue: {
      platform: data?.revenue?.platform ?? 0,
      seller: data?.revenue?.seller ?? 0,
      total: data?.revenue?.total ?? 0,

      // Updated: Transform monthlyData array (new format) or fallback to monthlyBreakdown (legacy)
      monthlyData: normalizeMonthlyData(data?.revenue?.monthlyData ?? data?.revenue?.monthlyBreakdown),
      
      monthlyGrowth: data?.revenue?.monthlyGrowth ?? 0,
    },

    products: {
      topSelling: (data?.products?.topSelling ?? []).map((product) => ({
        _id: product?._id ?? "",
        name: product?.name ?? "Unnamed Product",
        salesCount: product?.salesCount ?? 0,
        images: product?.images ?? [],
        price: product?.price ?? 0,
        stock: product?.stock ?? 0,
      })),

      lowStockCount: data?.products?.lowStockCount ?? 0,
    },

    users: {
      newLast7Days: data?.users?.newLast7Days ?? 0,
      activeLast30Days: data?.users?.activeLast30Days ?? 0,
      total: data?.users?.total ?? 0,
    },

    sellers: {
      topPerformers: (data?.sellers?.topPerformers ?? []).map((seller) => ({
        _id: seller?._id ?? "",
        businessName: seller?.businessName ?? "Unknown Seller",
        totalSales: seller?.totalSales ?? 0,
        rating: seller?.rating ?? 0,
        logo: seller?.logo ?? null,
      })),

      pendingApplications: data?.sellers?.pendingApplications ?? 0,
      total: data?.sellers?.total ?? 0,
    },

    recentOrders: (data?.recentOrders ?? []).map((order) => ({
      id: order?.id ?? "",
      user: order?.user ?? "Unknown User",
      amount: order?.amount ?? 0,
      status: order?.status ?? "pending",
      items: order?.items ?? 0,
      date: order?.date
        ? new Date(order.date)
        : new Date(),
    })),

    notifications: {
      recent: (data?.notifications?.recent ?? []).map(
        (notification) => ({
          id: notification?.id ?? crypto.randomUUID(),
          title: notification?.title ?? "Notification",
          message: notification?.message ?? "",
          type: notification?.type ?? "info",
          read: notification?.read ?? false,
          sender: notification?.sender ?? "System",
          date: notification?.date
            ? new Date(notification.date)
            : new Date(),
        })
      ),

      unreadCount: data?.notifications?.unreadCount ?? 0,
    },

    systemHealth: data?.systemHealth
      ? {
          uptime: data.systemHealth.uptime ?? 0,
          memoryUsage:
            data.systemHealth.memoryUsage ??
            ({
              rss: 0,
              heapTotal: 0,
              heapUsed: 0,
              external: 0,
              arrayBuffers: 0,
            } as NodeJS.MemoryUsage),
          nodeVersion: data.systemHealth.nodeVersion ?? process.version,
          environment: data.systemHealth.environment ?? process.env.NODE_ENV,
        }
      : undefined,

    // Add success flag if present
    success: data?.success ?? true,
  };
}

/**
 * Normalize monthly revenue data from either array format or legacy object format
 */
function normalizeMonthlyData(
  data: RevenueDataPoint[] | Record<string, number> | null | undefined
): RevenueDataPoint[] {
  // Handle array format (new backend)
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => ({
      month: item?.month ?? "Jan",
      sellerRevenue: item?.sellerRevenue ?? 0,
      platformRevenue: item?.platformRevenue ?? 0,
      totalRevenue: item?.totalRevenue ?? (item?.sellerRevenue ?? 0) + (item?.platformRevenue ?? 0),
    }));
  }

  // Handle legacy object format (monthlyBreakdown)
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return transformLegacyMonthlyData(data);
  }

  // Return empty array for no data
  return generateEmptyMonthlyData();
}

/**
 * Transform legacy monthlyBreakdown object to array format
 * Example input: { "Jan 2024": 15000, "Feb 2024": 18000 }
 */
function transformLegacyMonthlyData(breakdown: Record<string, number>): RevenueDataPoint[] {
  const months = Object.keys(breakdown).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (months.length === 0) {
    return generateEmptyMonthlyData();
  }

  // For legacy data, we only have total revenue, so we approximate seller/platform split
  // assuming platform takes ~20% and seller takes ~80% (adjust based on your business logic)
  const PLATFORM_PERCENTAGE = 0.20;
  const SELLER_PERCENTAGE = 0.80;

  return months.map((monthKey) => {
    const totalRevenue = breakdown[monthKey];
    const platformRevenue = Math.round(totalRevenue * PLATFORM_PERCENTAGE);
    const sellerRevenue = Math.round(totalRevenue * SELLER_PERCENTAGE);

    // Extract short month name (e.g., "Jan" from "Jan 2024")
    const shortMonth = monthKey.split(" ")[0] ?? monthKey.substring(0, 3);

    return {
      month: shortMonth,
      sellerRevenue,
      platformRevenue,
      totalRevenue,
    };
  });
}

/**
 * Generate empty monthly data for the last 12 months
 * Useful for initial state or when no data exists
 */
function generateEmptyMonthlyData(): RevenueDataPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  // Return last 12 months in order
  return Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    return {
      month: months[monthIndex],
      sellerRevenue: 0,
      platformRevenue: 0,
      totalRevenue: 0,
    };
  }).reverse();
}

/**
 * Optional: Helper to calculate summary statistics from monthly data
 */
export function calculateRevenueSummary(monthlyData: RevenueDataPoint[]) {
  if (!monthlyData || monthlyData.length === 0) {
    return {
      averageMonthlyRevenue: 0,
      bestMonth: null,
      worstMonth: null,
      totalRevenue: 0,
    };
  }

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const averageMonthlyRevenue = totalRevenue / monthlyData.length;
  
  const bestMonth = monthlyData.reduce((best, current) => 
    current.totalRevenue > best.totalRevenue ? current : best
  , monthlyData[0]);
  
  const worstMonth = monthlyData.reduce((worst, current) => 
    current.totalRevenue < worst.totalRevenue ? current : worst
  , monthlyData[0]);

  return {
    averageMonthlyRevenue,
    bestMonth,
    worstMonth,
    totalRevenue,
  };
}