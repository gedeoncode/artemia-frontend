"use client";

import { useState } from "react";
import { useSellerData, useNavigation, useDashboardAlerts } from "../hooks/";
import {
  DashboardHeader,
  DashboardContent,
  // DashboardAlerts,
  DashboardEmptyState,
  DashboardErrorState,
} from "./dashboardContent";
import type {
  DashboardFilters,
  ChartInterval,
  DashboardResponse,
} from "../types/dashboard.types";

type DashboardScreenProps = {
  initialData: DashboardResponse | null;
  initialFilters?: Partial<DashboardFilters>;
  pollingInterval?: number;
};

export function DashboardScreen({
  initialData,
  initialFilters = {},
  pollingInterval = 30000,
}: DashboardScreenProps) {
  // State management - minimized to only what's necessary
  const [filters, setFilters] = useState<DashboardFilters>({
    interval: "daily",
    compareWithPrevious: false,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    ...initialFilters,
  });

  // Data fetching - single source of truth
  const { data, error, refetch, isLoading, isFetching } = useSellerData({
    initialData: initialData!,
    filters,
    enabled: true,
    staleTime: 30000,
    refetchInterval: pollingInterval,
  });

  // Derived state
  const alerts = useDashboardAlerts(data);
  const { navigateTo } = useNavigation({
    sidebarClose: () => {},
    postLogoutRedirect: "/auth/login",
  });

  // Filter handlers - simplified
  const handleFilterChange = (newFilters: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Refetch happens automatically via useSellerData dependency on filters
  };

  const handleIntervalChange = (interval: ChartInterval) => {
    setFilters((prev) => ({ ...prev, interval }));
  };

  // Error state
  if (error) {
    return <DashboardErrorState error={error} onRetry={refetch} />;
  }

  // Empty state
  if (!data || !data.stats) {
    return <DashboardEmptyState onNavigate={navigateTo} />;
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader
        data={data}
        filters={filters}
        isFetching={isFetching}
        onFilterChange={handleFilterChange}
        onIntervalChange={handleIntervalChange}
        onRefresh={refetch}
      />

      {/* <DashboardAlerts alerts={alerts} onNavigate={navigateTo} /> */}

      <DashboardContent
        data={data}
        filters={filters}
        onNavigate={navigateTo}
        isLoading={isLoading}
        isFetching={isFetching}
        onMetricClick={(metric) => {
          // Handle metric click for chart selection if needed
          console.log(`Metric clicked: ${metric}`);
        }}
      />
    </div>
  );
}
