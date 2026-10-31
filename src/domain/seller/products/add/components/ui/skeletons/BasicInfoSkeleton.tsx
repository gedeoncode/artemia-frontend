"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function BasicInfoSkeleton() {
  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <Skeleton className="w-32 h-4 mb-2" />
        <Skeleton className="w-full h-9" />
      </div>

      {/* Description */}
      <div>
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-full h-24" />
      </div>

      {/* Category */}
      <div>
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-full h-9" />
      </div>

      {/* Category-specific fields placeholder */}
      <div className="space-y-2">
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-3/4 h-9" />
      </div>

      {/* Physical product checkbox */}
      <div className="flex items-center space-x-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-48 h-4" />
      </div>

      {/* Footer note */}
      <Skeleton className="w-64 h-3" />
    </div>
  );
}
