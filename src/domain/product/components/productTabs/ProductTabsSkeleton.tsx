// components/ProductTabs/ProductTabsSkeleton.tsx
"use client";

import { memo } from "react";

export const ProductTabsSkeleton = memo(function ProductTabsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="border-b border-gray-200">
        <div className="flex gap-4 px-6 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
});