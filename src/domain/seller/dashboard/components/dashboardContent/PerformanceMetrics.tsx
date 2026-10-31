// components/PerformanceMetrics.tsx
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Activity,
} from "lucide-react";
import { MetricCard } from "../../types";
import { MetricSkeleton } from "../ui";

interface PerformanceMetricsProps {
  stats: {
    //added
    // cancelledOrders: number;
    // convertedLeads: number;
    // leadSources: string[];
    // phoneLeads: number;
    // topConvertingProducts: string[];
    // unreadCount: number;
    // whatsappLeads: number;

    // old data
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalProducts: number;
    conversionRate: number;
    avgOrderValue: number;
    totalLeads?: number;
  };
  performance: {
    // avgOrderValue: 0;
    // cancellationRate: 0;
    // conversionRate: 0;

    revenueGrowth: number;
    orderGrowth: number;
    conversionRateChange: number;
    customerRetention: number;
  };
  onMetricClick?: (metricId: string) => void;
}

const formatValue = (value: number, format?: string): string => {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "percentage":
      return `${value.toFixed(1)}%`;
    case "duration":
      const hours = Math.floor(value);
      const minutes = Math.round((value - hours) * 60);
      return `${hours}h ${minutes}m`;
    default:
      return value.toLocaleString();
  }
};

export function PerformanceMetrics({
  stats,
  performance,
  onMetricClick,
}: PerformanceMetricsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const metrics: MetricCard[] = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: stats.totalRevenue,
      change: performance.revenueGrowth,
      changeLabel: "vs previous period",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-400 to-green-600",
      format: "currency",
      onClick: () => onMetricClick?.("revenue"),
    },
    {
      id: "orders",
      title: "Completed Orders",
      value: stats.completedOrders,
      change: performance.orderGrowth,
      changeLabel: "vs previous period",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "from-blue-400 to-blue-600",
      format: "number",
      onClick: () => onMetricClick?.("orders"),
    },
    {
      id: "conversion",
      title: "Conversion Rate",
      value: stats.conversionRate,
      change: performance.conversionRateChange,
      changeLabel: "from leads",
      icon: <Activity className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600",
      format: "percentage",
      onClick: () => onMetricClick?.("conversion"),
    },
    {
      id: "avgOrder",
      title: "Avg Order Value",
      value: stats.avgOrderValue,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-yellow-400 to-yellow-600",
      format: "currency",
      onClick: () => onMetricClick?.("avgOrder"),
    },
    {
      id: "pendingOrders",
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <Package className="w-6 h-6" />,
      color: "from-orange-400 to-orange-600",
      format: "number",
      onClick: () => onMetricClick?.("pendingOrders"),
    },
    {
      id: "customerRetention",
      title: "Customer Retention",
      value: performance.customerRetention,
      icon: <Users className="w-6 h-6" />,
      color: "from-pink-400 to-pink-600",
      format: "percentage",
      onClick: () => onMetricClick?.("customerRetention"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 lg:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className={`
            relative overflow-hidden bg-white rounded-lg shadow 
            transform transition-all duration-200 ease-in-out
            ${metric.onClick ? "cursor-pointer hover:shadow-lg hover:-translate-y-1" : ""}
          `}
          onClick={metric.onClick}
          onMouseEnter={() => setHoveredCard(metric.id)}
          onMouseLeave={() => setHoveredCard(null)}
          role={metric.onClick ? "button" : "article"}
          tabIndex={metric.onClick ? 0 : undefined}
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 transition-opacity duration-300 ${
              hoveredCard === metric.id ? "opacity-5" : ""
            }`}
          />

          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="text-gray-400">{metric.icon}</div>

              {metric.change !== undefined && (
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    metric.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(metric.change).toFixed(1)}%</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 truncate">
                {metric.title}
              </h3>

              <div className="mt-2">
                <span className="text-2xl font-semibold text-gray-900">
                  {formatValue(metric.value, metric.format)}
                </span>

                {metric.changeLabel && (
                  <span className="ml-2 text-xs text-gray-500">
                    {metric.changeLabel}
                  </span>
                )}
              </div>

              {/* Sparkline trend indicator */}
              {hoveredCard === metric.id && metric.change !== undefined && (
                <div className="mt-3 text-xs text-gray-500 animate-fade-in">
                  {metric.change >= 0 ? "↑ Upward trend" : "↓ Downward trend"}
                </div>
              )}
            </div>
          </div>

          {/* Progress bar for certain metrics */}
          {metric.id === "conversion" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${Math.min(100, stats.conversionRate)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
