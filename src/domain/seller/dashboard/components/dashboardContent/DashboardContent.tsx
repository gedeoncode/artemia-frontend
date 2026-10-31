"use client";

import { memo } from "react";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { ChartWidget } from "./ChartWidget";
import { InsightsPanel } from "./InsightsPanel";
import { InventoryAlerts } from "./InventoryAlerts";
import { LeadConversionFunnel } from "./LeadConversionFunnel";
import { ActivitySection } from "./ActivitySection";
import type {
  DashboardResponse,
  DashboardFilters,
} from "../../types/dashboard.types";
import { DashboardContentSkeleton } from "../ui";

type DashboardContentProps = {
  data: DashboardResponse;
  filters: DashboardFilters;
  onNavigate: (path: string) => void;
  onMetricClick: (metric: string) => void;
  isLoading: boolean;
  isFetching: boolean;
};

export const DashboardContent = memo(function DashboardContent({
  data,
  filters,
  onNavigate,
  onMetricClick,
  isLoading,
  isFetching,
}: DashboardContentProps) {
  const {
    stats,
    performance,
    charts,
    recentActivities,
    alerts,
    insights,
    metadata,
  } = data;
  if (!isLoading && isFetching) return <DashboardContentSkeleton />;
  return (
    <main className="mx-auto w-full px-4 sm:px-6 py-4 lg:px-8 space-y-3 sm:space-y-5 lg:space-y-6">
      {/* Key metrics */}
      <section aria-label="Key performance metrics">
        <PerformanceMetrics
          stats={stats}
          performance={performance}
          onMetricClick={onMetricClick}
        />
      </section>

      {/* Charts grid */}
      <section
        aria-label="Analytics charts"
        className="space-y-3 sm:space-y-5 lg:space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartWidget
            title="Revenue Trends"
            data={charts.revenue}
            type="line"
            height={400}
            showLegend
            onTimeRangeChange={() => {}} // Handled by parent filters
          />

          <ChartWidget
            title="Order Analytics"
            data={charts.orders}
            type="bar"
            height={400}
            showLegend
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ChartWidget
            title="Category Performance"
            data={charts.categoryDistribution}
            type="pie"
            height={300}
          />

          <div className="lg:col-span-2">
            <LeadConversionFunnel
              data={charts.leadConversion}
              conversionRate={stats.conversionRate}
              onViewDetails={() => onNavigate("/seller/leads")}
            />
          </div>
        </div>
      </section>

      {/* Insights panel */}
      {insights && insights.length > 0 && (
        <section aria-label="Business insights">
          <InsightsPanel
            insights={insights}
            onInsightClick={(insight) => {
              if (insight.action) onNavigate(insight.action.link);
            }}
          />
        </section>
      )}

      {/* Inventory alerts */}
      {(alerts?.lowStock?.length > 0 || alerts?.inventory?.length > 0) && (
        <section aria-label="Inventory alerts">
          <InventoryAlerts
            lowStockProducts={alerts.lowStock || []}
            inventoryAlerts={alerts.inventory || []}
            onViewInventory={() => onNavigate("/seller/inventory")}
            onReorder={(productId) =>
              onNavigate(`/seller/products/${productId}/reorder`)
            }
          />
        </section>
      )}

      {/* Recent activity */}
      <section aria-label="Recent activity">
        <ActivitySection
          orders={recentActivities.orders}
          leads={recentActivities.leads}
          onNavigate={onNavigate}
        />
      </section>

      {/* Metadata footer */}
      <footer className="pt-6 mt-6 text-xs text-gray-400 border-t border-gray-100">
        <div className="flex flex-wrap justify-between gap-2">
          <span>
            Last updated: {new Date(metadata.lastUpdated).toLocaleString()}
          </span>
          <span>
            Period: {new Date(metadata.period.start).toLocaleDateString()} -{" "}
            {new Date(metadata.period.end).toLocaleDateString()}
          </span>
        </div>
      </footer>
    </main>
  );
});
