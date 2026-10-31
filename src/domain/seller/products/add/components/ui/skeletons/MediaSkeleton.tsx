"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function MediaSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="w-48 h-5 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Upload Zone */}
      <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl bg-gray-50">
        <Skeleton className="w-10 h-10 mb-3 rounded-full" />
        <Skeleton className="w-56 h-4 mb-2" />
        <Skeleton className="w-40 h-3" />
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
          >
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-3" />
                <Skeleton className="w-10 h-3" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden border-2 border-gray-200 rounded-lg aspect-square"
          >
            <Skeleton className="absolute inset-0" />
            <Skeleton className="absolute w-16 h-4 rounded-full top-2 left-2" />
            <Skeleton className="absolute w-6 h-6 rounded-full top-2 right-2" />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <Skeleton className="h-3 w-72" />
    </div>
  );
}
