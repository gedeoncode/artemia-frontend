import { Skeleton } from "@/components/ui";

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-7 w-[220px]" />
          </div>
          <Skeleton className="h-6 w-[70px] rounded-full" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="hidden md:flex flex-col gap-2">
              <Skeleton className="h-3 w-[90px]" />
              <Skeleton className="h-3 w-[70px]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`stat-skeleton-${index}`}
          className="relative overflow-hidden rounded-lg border bg-card p-6"
        >
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          
          <div className="pt-2">
            <Skeleton className="h-8 w-[140px] mb-3" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueAnalyticsSkeleton() {
  return (
    <div className="rounded-lg border bg-card lg:col-span-2 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-[220px]" />
            <Skeleton className="h-4 w-[320px]" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`revenue-card-${index}`} className="rounded-lg border p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-[110px]" />
                <Skeleton className="h-8 w-[140px]" />
                <Skeleton className="h-3 w-[120px]" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <Skeleton className="h-[360px] w-full rounded-xl" />
          <div className="flex items-center justify-center gap-4">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SellerRankingsSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[220px]" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`seller-ranking-${index}`}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[140px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-[80px]" />
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-6 w-[40px] rounded-full" />
          </div>
          <Skeleton className="h-3 w-[220px]" />
        </div>
      </div>
    </div>
  );
}

function TopProductsSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-[220px]" />
          <Skeleton className="h-4 w-[70px]" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`product-skeleton-${index}`}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-3 w-[140px]" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-3 w-[50px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <Skeleton className="h-6 w-[180px] mb-4" />
        
        <div className="space-y-3">
          <div className="grid w-full grid-cols-2 gap-2 mb-4">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`activity-skeleton-${index}`}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[140px]" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-[70px]" />
                  <Skeleton className="h-5 w-[80px] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemHealthSkeleton() {
  return (
    <div className="mt-6 p-4 rounded-lg border">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-3 w-[120px]" />
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[90px]" />
        </div>
        <Skeleton className="h-3 w-[180px]" />
      </div>
    </div>
  );
}

export default function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <HeaderSkeleton />

      <main className="px-4 py-6 md:px-6 lg:px-8">
        <StatsGridSkeleton />

        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          <RevenueAnalyticsSkeleton />
          <SellerRankingsSkeleton />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopProductsSkeleton />
          <RecentActivitySkeleton />
        </div>

        <SystemHealthSkeleton />
      </main>
    </div>
  );
}