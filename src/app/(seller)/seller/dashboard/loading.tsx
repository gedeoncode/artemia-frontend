// app/(seller)/dashboard/loading.tsx

"use client";

import { Skeleton } from "@/components/ui/";
import {
  DashboardContentSkeleton,
  DashboardHeaderSkeleton,
} from "@/domain/seller/dashboard/components/";

// ============= MAIN LOADING COMPONENT =============

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Desktop Sidebar */}
      {/* <DesktopSidebarSkeleton /> */}

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header (only visible on mobile) */}
        <header className="md:hidden sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="w-9 h-9 rounded-lg" />
          </div>
        </header>

        <div className="flex-1">
          <article className="relative">
            <DashboardHeaderSkeleton />
            <DashboardContentSkeleton />
          </article>
        </div>
      </main>
    </div>
  );
}
