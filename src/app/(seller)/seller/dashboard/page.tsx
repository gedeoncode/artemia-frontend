import { getSellerDashboard } from "@/domain/seller/dashboard/services/";

import { DashboardScreen } from "@/domain/seller/dashboard/components";
import { connection } from "next/server";

interface DashboardPageProps {
  searchParams?: Promise<{
    refresh?: string;
    interval?: string;
    compare?: string;
    month?: string;
    year?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  await connection()
  const params = await searchParams
  // Extract query parameters
  const interval =
    (params?.interval as "hourly" | "daily" | "weekly" | "monthly") ||
    "daily";
  const compareWithPrevious = params?.compare === "true";
  const month = params?.month
    ? parseInt(params.month)
    : new Date().getMonth() + 1;
  const year = params?.year
    ? parseInt(params.year)
    : new Date().getFullYear();

  // Fetch dashboard data with query params
  const dashboardData = await getSellerDashboard({
    params: {
      month,
      year,
      interval,
      compareWithPrevious,
    },
  });

  return (
    <DashboardScreen
      initialData={dashboardData}
      initialFilters={{
        interval,
        compareWithPrevious,
        month,
        year,
      }}
    />
  );
}
