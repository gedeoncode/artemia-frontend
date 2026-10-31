"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function SuccessShimmer() {
  return (
    <div className="max-w-2xl p-6 mx-auto space-y-10 md:p-8 animate-fadeIn">
      <div className="space-y-3 text-center">
        <div className="mx-auto bg-gray-200 rounded-full w-14 h-14 animate-pulse" />
        <Skeleton className="w-48 mx-auto h-7" />
        <Skeleton className="w-64 h-4 mx-auto" />
      </div>

      <div className="p-6 space-y-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <Skeleton className="w-40 h-5 ml-12" />
        <Skeleton className="w-56 h-4 ml-12" />
        <Skeleton className="w-4/5 h-4 ml-12" />
      </div>

      <div className="p-6 space-y-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <Skeleton className="w-40 h-5 ml-12" />
        <Skeleton className="w-56 h-4 ml-12" />
        <Skeleton className="w-4/5 h-4 ml-12" />
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    </div>
  );
}
