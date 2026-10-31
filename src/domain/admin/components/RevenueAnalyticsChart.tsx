// components/dashboard/RevenueAnalyticsChart.tsx
"use client"
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils"; // Optional: utility for conditional classes

// ------------------------------------------------------------------
// Types & Interfaces
// ------------------------------------------------------------------

export interface RevenueDataPoint {
  month: string;
  sellerRevenue: number;
  platformRevenue: number;
  totalRevenue: number;
}

export interface RevenueAnalyticsChartProps {
  /** Array of monthly revenue data points */
  data: RevenueDataPoint[];
  /** Whether the chart is in a loading state */
  isLoading?: boolean;
  /** Optional className for the outer container */
  className?: string;
  /** Optional title for the chart card */
  title?: string;
  /** Optional subtitle or description */
  description?: string;
  /** Currency symbol (default: '$') */
  currencySymbol?: string;
  /** Height of the chart in pixels (default: 320) */
  height?: number;
}

// ------------------------------------------------------------------
// Helper Components
// ------------------------------------------------------------------

const LoadingSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
        <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
      </div>
      <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    </div>
    <div className="space-y-3">
      <div className="h-[280px] bg-gray-100 dark:bg-gray-800/50 rounded-xl"></div>
      <div className="flex gap-4 mt-4">
        <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
        <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
        <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-4 mb-4 rounded-full bg-gray-100 dark:bg-gray-800/50">
      <DollarSign className="w-8 h-8 text-gray-400 dark:text-gray-600" />
    </div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
      No revenue data available
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      Check back later for analytics
    </p>
  </div>
);

// Custom tooltip component with modern styling and currency formatting
const CustomTooltip = ({ active, payload, label, currencySymbol = "$" }: any) => {
  if (!active || !payload || !payload.length) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">{entry.name}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom legend renderer with modern interactive styling
const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {payload.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-default"
        >
          <div
            className="w-3 h-3 rounded-full transition-all"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Format large numbers for Y-axis (1k, 10k, 100k, 1M)
const formatYAxisTick = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return value.toString();
};

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export const RevenueAnalyticsChart: React.FC<RevenueAnalyticsChartProps> = ({
  data,
  isLoading = false,
  className,
  title = "Revenue Analytics",
  description = "Monthly revenue breakdown across all sellers",
  currencySymbol = "$",
  height = 320,
}) => {
  const [mounted, setMounted] = useState(false);

  // Handle animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate summary stats for the subtle metric cards
  const totalSellerRevenue = data.reduce((sum, item) => sum + item.sellerRevenue, 0);
  const totalPlatformRevenue = data.reduce((sum, item) => sum + item.platformRevenue, 0);
  const totalOverallRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const averageGrowth = data.length > 1
    ? ((data[data.length - 1].totalRevenue - data[0].totalRevenue) / data[0].totalRevenue) * 100
    : 0;

  const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full rounded-2xl bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-5 shadow-sm",
          className
        )}
      >
        <LoadingSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "w-full rounded-2xl bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-5 shadow-sm",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-5 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        {/* Summary Metrics (Compact for mobile) */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#8884d8]" />
            <span className="text-gray-500 dark:text-gray-400">Seller</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrencyCompact(totalSellerRevenue)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#82ca9d]" />
            <span className="text-gray-500 dark:text-gray-400">Platform</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrencyCompact(totalPlatformRevenue)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800/50">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatCurrencyCompact(totalOverallRevenue)}
            </span>
            {averageGrowth !== 0 && (
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium ml-1",
                  averageGrowth >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {averageGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(averageGrowth).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Gradients for each area */}
              <linearGradient id="gradientSeller" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientPlatform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="stroke-gray-200 dark:stroke-gray-800"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-gray-500 dark:text-gray-400"
              dy={8}
            />

            <YAxis
              tickFormatter={formatYAxisTick}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-gray-500 dark:text-gray-400"
              dx={-8}
            />

            <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />

            <Legend content={<CustomLegend />} />

            <Area
              type="monotone"
              dataKey="sellerRevenue"
              name="Seller Revenue"
              stroke="#8884d8"
              strokeWidth={2}
              fill="url(#gradientSeller)"
              fillOpacity={1}
              isAnimationActive={mounted}
              animationDuration={1000}
              animationBegin={0}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />

            <Area
              type="monotone"
              dataKey="platformRevenue"
              name="Platform Revenue"
              stroke="#82ca9d"
              strokeWidth={2}
              fill="url(#gradientPlatform)"
              fillOpacity={1}
              isAnimationActive={mounted}
              animationDuration={1000}
              animationBegin={200}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />

            <Area
              type="monotone"
              dataKey="totalRevenue"
              name="Total Revenue"
              stroke="#ffc658"
              strokeWidth={2.5}
              fill="url(#gradientTotal)"
              fillOpacity={1}
              isAnimationActive={mounted}
              animationDuration={1000}
              animationBegin={400}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote for data freshness */}
      <div className="mt-4 text-center">
        <p className="text-[11px] text-gray-400 dark:text-gray-600">
          Updated monthly • Last 12 months
        </p>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Example Mock Data
// ------------------------------------------------------------------

export const mockRevenueData: RevenueDataPoint[] = [
  { month: "Jan", sellerRevenue: 12400, platformRevenue: 3100, totalRevenue: 15500 },
  { month: "Feb", sellerRevenue: 14200, platformRevenue: 3550, totalRevenue: 17750 },
  { month: "Mar", sellerRevenue: 16800, platformRevenue: 4200, totalRevenue: 21000 },
  { month: "Apr", sellerRevenue: 18200, platformRevenue: 4550, totalRevenue: 22750 },
  { month: "May", sellerRevenue: 20900, platformRevenue: 5225, totalRevenue: 26125 },
  { month: "Jun", sellerRevenue: 22400, platformRevenue: 5600, totalRevenue: 28000 },
  { month: "Jul", sellerRevenue: 24800, platformRevenue: 6200, totalRevenue: 31000 },
  { month: "Aug", sellerRevenue: 26700, platformRevenue: 6675, totalRevenue: 33375 },
  { month: "Sep", sellerRevenue: 28900, platformRevenue: 7225, totalRevenue: 36125 },
  { month: "Oct", sellerRevenue: 31200, platformRevenue: 7800, totalRevenue: 39000 },
  { month: "Nov", sellerRevenue: 34800, platformRevenue: 8700, totalRevenue: 43500 },
  { month: "Dec", sellerRevenue: 39200, platformRevenue: 9800, totalRevenue: 49000 },
];

// ------------------------------------------------------------------
// Example Usage (how to replace the placeholder)
// ------------------------------------------------------------------

/*
import { RevenueAnalyticsChart, mockRevenueData } from "@/components/dashboard/RevenueAnalyticsChart";

// Inside your dashboard page/component:

<div className="mt-6">
  <RevenueAnalyticsChart 
    data={stats.revenue.monthlyData || mockRevenueData}
    isLoading={isRevenueLoading}
    title="Revenue Performance"
    description="Track seller & platform earnings over time"
  />
</div>

// Replace your placeholder with:
// {/*
//   <div className="flex items-center justify-center h-40 mt-3 rounded">
//     <div className="flex items-center justify-center w-full h-full border border-blue-100 rounded bg-gradient-to-r from-white to-blue-50">
//       <p className="text-sm text-gray-500">Monthly Revenue Chart</p>
//     </div>
//   </div>
// */