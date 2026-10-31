import { Skeleton } from "@/components/ui/";

export function LeadConversionFunnelSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" aria-hidden="true">
      {/* Header Area */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-44 sm:h-6 sm:w-52" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>

      {/* Conversion Summary Banner Block */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-36" />
            <div className="flex items-baseline space-x-2">
              <Skeleton className="h-8 w-20 sm:h-9" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="mt-3 h-2 w-full rounded-full" />
      </div>

      {/* Main Graph/Funnel Area Canvas Placeholder */}
      <div className="p-3 sm:p-6">
        <div className="w-full flex flex-col items-center justify-center h-[320px] md:h-[360px] lg:h-[400px] space-y-3 px-6 sm:px-12">
          {/* Mocking concentric geometric funnel shapes layers smoothly downwards */}
          <Skeleton className="h-12 w-full max-w-[85%] rounded" />
          <Skeleton className="h-12 w-[70%] rounded" />
          <Skeleton className="h-12 w-[55%] rounded" />
          <Skeleton className="h-12 w-[40%] rounded" />
        </div>

        {/* Stage Details Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="p-3 sm:p-4 rounded-lg bg-gray-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-10" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  {idx > 0 && <Skeleton className="h-3 w-10" />}
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Low Opacity Conditional Recommendation Insight Container Box */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border border-gray-100 bg-gray-50/30 space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-3.5 w-5/6 mt-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}