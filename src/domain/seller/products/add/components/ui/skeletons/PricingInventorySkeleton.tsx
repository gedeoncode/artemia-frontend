"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function PricingInventorySkeleton() {
  return (
    <section className="p-6 space-y-6 bg-white border shadow-sm rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="w-56 h-5 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="w-32 h-6 rounded-md" />
      </div>

      {/* Price Input */}
      <div>
        <Skeleton className="w-24 h-4 mb-3" />
        <div className="relative mt-2">
          <Skeleton className="absolute w-4 h-4 rounded-full left-3 top-2" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        <Skeleton className="w-64 h-3 mt-2" />
      </div>

      {/* Preview Box (simulated expanded state) */}
      <div className="p-4 space-y-2 border rounded-lg bg-gray-50">
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-56 h-4" />
        <Skeleton className="w-64 h-4" />
      </div>
    </section>
  );
}
