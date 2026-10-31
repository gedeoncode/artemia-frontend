"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function SidebarSkeleton() {
  return (
    <aside className="sticky top-0 z-30 flex-col justify-between hidden w-64 h-screen bg-white border-r border-gray-100 md:flex">
      <div className="flex flex-col justify-between h-full p-6 space-y-10 animate-pulse">
        {/* Header: Logo + Title */}
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-6" />
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full rounded-md h-9" />
          ))}
        </nav>

        {/* Footer: Logout + Settings */}
        <footer className="pt-4 mt-6 space-y-3 border-t border-gray-100">
          <Skeleton className="w-full rounded-md h-9" />
          <Skeleton className="w-full rounded-md h-9" />
        </footer>
      </div>
    </aside>
  );
}
