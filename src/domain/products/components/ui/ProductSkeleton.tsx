"use client";

import { Skeleton } from "@/components/ui/Skeleton";

type ProductsGridSkeletonProps = {
  count: number;
};

export function ProductsGridSkeleton({
  count ,
}: ProductsGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <article
      className="p-4 bg-white border border-gray-100 rounded-md shadow-sm"
      aria-hidden="true"
    >
      {/* Image */}
      <div className="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-50">
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      </div>

      <div className="mt-4 space-y-3">
        {/* Title Placeholder */}
        <div className="space-y-2">
          <Skeleton className="w-11/12 h-4" />
          <Skeleton className="w-3/4 h-4" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-10/12 h-3" />
        </div>

        {/* Category */}
        <Skeleton className="w-1/4 h-3" />

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="w-1/4 h-5" />
          <Skeleton className="w-1/6 h-4" />
        </div>
      </div>
    </article>
  );
}
