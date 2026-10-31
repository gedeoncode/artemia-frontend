// ../hooks/useSellerData.ts
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { DashboardResponse, DashboardFilters } from "../types/";

interface UseSellerDataOptions {
  initialData: DashboardResponse;
  filters: DashboardFilters;
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
  onSuccess?: (data: DashboardResponse) => void;
  onError?: (error: Error) => void;
}

export function useSellerData({
  initialData,
  filters,
  enabled,
  staleTime = 30000,
  refetchInterval = 30000,
  onSuccess,
  onError,
}: UseSellerDataOptions) {
  const [dataAge, setDataAge] = useState<number>(0);

  const fetchDashboard = async (): Promise<DashboardResponse> => {
    const params = new URLSearchParams({
      month: filters.month.toString(),
      year: filters.year.toString(),
      interval: filters.interval,
      compareWithPrevious: filters.compareWithPrevious.toString(),
    });

    const response = await fetch(`/api/seller/dashboard?${params}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch dashboard data");
    }

    const data = await response.json();
    return data;
  };
  console.log("FETCHING", filters);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["sellerDashboard", filters],
    queryFn: fetchDashboard,
    initialData,
    staleTime,
    refetchInterval,
    enabled,
    onSuccess: (data: DashboardResponse) => {
      // Update data age
      setDataAge(Date.now() - new Date(data.metadata.lastUpdated).getTime());
      onSuccess?.(data);
    },
    onError,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
useEffect(() => {
  console.log("isFetching:", isFetching);
}, [isFetching]);

useEffect(() => {
  console.log("queryKey filters:", filters);
}, [filters]);
  return {
    data: data!,
    error,
    isLoading,
    isFetching,
    refetch,
    dataAge,
  };
}
