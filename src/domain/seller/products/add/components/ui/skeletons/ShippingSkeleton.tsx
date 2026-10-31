"use client";

import { Skeleton } from "@/components/ui/Skeleton";

interface ShippingSkeletonProps {
  /** Whether the product is physical */
  isPhysical?: boolean;
}

export function ShippingSkeleton({ isPhysical = true }: ShippingSkeletonProps) {
  if (!isPhysical) {
    return (
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <div className="space-y-2">
          <Skeleton className="h-4 w-72" />
          <Skeleton className="w-64 h-3" />
        </div>
      </div>
    );
  }

  return (
    <section className="p-6 space-y-6 bg-white border shadow-sm rounded-2xl">
      {/* Header */}
      <div>
        <Skeleton className="w-56 h-5 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Weight + Country grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Weight field */}
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <div className="relative mt-1">
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="absolute w-12 h-6 rounded-md right-2 top-2" />
          </div>
          <Skeleton className="w-40 h-3" />
        </div>

        {/* Country field */}
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-64 h-3" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>

      {/* HS Code field */}
      <div className="space-y-2">
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-64 h-3" />
      </div>

      {/* Footer note */}
      <div className="pt-2">
        <Skeleton className="h-3 w-72" />
      </div>
    </section>
  );
}
