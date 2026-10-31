// ============= SIDEBAR SKELETONS =============

import { Skeleton } from "@/components/ui";
import { cn } from "@/lib";

// Desktop Sidebar Skeleton
export const DesktopSidebarSkeleton = () => {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 z-30",
        "w-72",
        "bg-white dark:bg-gray-950",
        "border-r border-gray-200 dark:border-gray-800",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.02),8px_0_24px_rgba(0,0,0,0.04)]",
      )}
      aria-label="Loading sidebar"
    >
      <div className="flex flex-col h-full gap-1">
        {/* Brand / Header Section */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-2 mx-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto my-1">
          <div className="mx-2 space-y-0.5">
            <div className="px-2 pb-2">
              <Skeleton className="h-3 w-12" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
              >
                <Skeleton className="w-4 h-4 shrink-0 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
            <div className="px-2 pb-1 pt-4">
              <Skeleton className="h-3 w-16" />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`support-${i}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
              >
                <Skeleton className="w-4 h-4 shrink-0 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mx-3 pb-3 space-y-0.5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <Skeleton className="w-4 h-4 shrink-0 rounded" />
            <Skeleton className="h-4 flex-1" />
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <Skeleton className="w-4 h-4 shrink-0 rounded" />
            <Skeleton className="h-4 flex-1" />
          </div>
        </div>
      </div>
    </aside>
  );
};

// ============= DASHBOARD HEADER SKELETONS =============

export const DashboardHeaderSkeleton = () => {
  return (
    <header className="sticky top-0 z-20 bg-background/98 backdrop-blur-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Row 1: Title + Actions */}
        <div className="flex items-center justify-between h-12">
          {/* Title Area */}
          <div className="flex items-baseline gap-2 min-w-0">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-4 w-40 hidden sm:block" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-8 w-8 sm:w-24 rounded-md" />
            <Skeleton className="h-8 w-8 sm:w-24 rounded-md" />
          </div>
        </div>

        {/* Row 2: Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-2 py-2 border-t">
          {/* Month / Year Group */}
          <div className="flex items-center gap-1 rounded-md p-0.5 bg-muted/30">
            <Skeleton className="h-8 w-[130px] rounded-md" />
            <Skeleton className="h-5 w-px" />
            <Skeleton className="h-8 w-[85px] rounded-md" />
          </div>

          {/* Interval Toggle */}
          <div className="flex items-center gap-0.5 rounded-md p-0.5 bg-muted/30">
            <Skeleton className="h-8 w-[70px] rounded-md" />
            <Skeleton className="h-8 w-[70px] rounded-md" />
            <Skeleton className="h-8 w-[80px] rounded-md" />
          </div>
        </div>
      </div>
    </header>
  );
};

// ============= DASHBOARD CONTENT SKELETONS =============

const SkeletonCard = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sm:p-5",
      className,
    )}
  >
    {children}
  </div>
);

export const MetricSkeleton = () => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sm:p-5 space-y-3">
    <div className="flex items-center gap-1 justify-between">
      <Skeleton className="h-6 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-8 w-30" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="flex items-end gap-1 h-48">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  </SkeletonCard>
);

export const PieChartSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-4">
      <Skeleton className="h-5 w-40 mx-auto" />
      <div className="flex justify-center py-6">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  </SkeletonCard>
);

export const FunnelSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-4">
      <Skeleton className="h-5 w-40 mx-auto" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton
              className="h-2 rounded-full"
              style={{ width: `${100 - i * 20}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  </SkeletonCard>
);

export const InsightsSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonCard>
);

export const InventoryAlertsSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  </SkeletonCard>
);

export const ActivitySkeleton = () => (
  <SkeletonCard>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  </SkeletonCard>
);

export const DashboardContentSkeleton = () => {
  return (
    <main className="mx-auto w-full px-4 sm:px-6 py-4 lg:px-8 space-y-3 sm:space-y-5 lg:space-y-6">
      <div className="grid grid-cols-1 gap-3 lg:gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PieChartSkeleton />
        <div className="lg:col-span-2">
          <FunnelSkeleton />
        </div>
      </div>

      <InsightsSkeleton />
      <InventoryAlertsSkeleton />
      <ActivitySkeleton />
    </main>
  );
};
