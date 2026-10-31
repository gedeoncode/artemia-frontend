import { useMemo } from "react";
import { Alert, DashboardResponse } from "../types";

export function useDashboardAlerts(data: DashboardResponse | null): Alert[] {
  return useMemo(() => {
    if (!data) return [];

    const alerts: Alert[] = [];

    // Low stock alerts
    if (data.alerts?.lowStock?.length > 0) {
      alerts.push({
        id: "low-stock",
        type: "warning",
        title: "Low Stock Alert",
        message: `${data.alerts.lowStock.length} products are running low on stock`,
        priority: "high",
        timestamp: new Date(),
        action: {
          label: "View Products",
          onClick: () => {}, // Will be overridden by parent
        },
      });
    }

    // Pending orders threshold
    if (data.alerts?.pendingOrders?.count > 10) {
      alerts.push({
        id: "pending-orders",
        type: "warning",
        title: "Pending Orders",
        message: data.alerts.pendingOrders.message,
        priority: "high",
        timestamp: new Date(),
        action: {
          label: "View Orders",
          onClick: () => {},
        },
      });
    }

    // Revenue decline
    if (data.performance?.revenueGrowth < -10) {
      alerts.push({
        id: "revenue-decline",
        type: "error",
        title: "Revenue Decline Alert",
        message: `Revenue has decreased by ${Math.abs(data.performance.revenueGrowth).toFixed(1)}% compared to previous period`,
        priority: "high",
        timestamp: new Date(),
      });
    }

    // Positive improvement
    if (data.performance?.conversionRateChange > 5) {
      alerts.push({
        id: "conversion-improvement",
        type: "success",
        title: "Conversion Rate Improvement",
        message: `Conversion rate improved by ${data.performance.conversionRateChange.toFixed(1)}%`,
        priority: "low",
        timestamp: new Date(),
      });
    }

    return alerts;
  }, [data]);
}
