"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function ReviewSkeleton() {
  return (
    <section className="p-6 space-y-8 bg-white border shadow-sm rounded-2xl">
      {/* HEADER */}
      <header className="space-y-2">
        <Skeleton className="w-48 h-5" />
        <Skeleton className="h-3 w-80" />
      </header>

      {/* PRODUCT OVERVIEW */}
      <div className="p-4 space-y-3 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-32 h-4" />
        </div>

        <div className="space-y-2">
          <Skeleton className="w-56 h-3" />
          <Skeleton className="w-64 h-3" />
          <Skeleton className="w-40 h-3" />
          <Skeleton className="w-48 h-3" />
        </div>

        {/* Images preview grid */}
        <div className="mt-3 space-y-2">
          <Skeleton className="w-32 h-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-20 h-20 border border-gray-200 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY & ATTRIBUTES */}
      <div className="p-4 space-y-3 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-40 h-4" />
        </div>

        <div className="space-y-2">
          <Skeleton className="w-56 h-3" />
          <Skeleton className="w-48 h-3" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>

      {/* PRICING & COMMISSION */}
      <div className="p-4 space-y-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 w-44" />
        </div>

        {/* Key details */}
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="w-32 h-3" />
              <Skeleton className="w-24 h-3" />
            </div>
          ))}
        </div>

        {/* Commission info box */}
        <div className="p-3 space-y-2 border-l-4 border-green-300 rounded-md bg-green-50">
          <Skeleton className="h-3 w-80" />
          <Skeleton className="h-3 w-60" />
        </div>
      </div>

      {/* OPTIONAL WARNING */}
      <div className="flex items-start gap-2 p-3 border border-yellow-200 rounded-md bg-yellow-50">
        <Skeleton className="w-5 h-5 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-72" />
          <Skeleton className="w-56 h-3" />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-4 space-y-2 border-t">
        <Skeleton className="h-3 w-80" />
        <Skeleton className="w-64 h-3" />
      </footer>
    </section>
  );
}
