import { Skeleton } from "@/components/ui/";

export function ActivitySectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" aria-hidden="true">
      
      {/* Recent Orders Card Skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Header Block */}
        <div className="px-6 py-4 border-b border-gray-100">
          <Skeleton className="h-5 w-28" />
        </div>

        {/* Orders Row List (Simulates 5 Items) */}
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, idx) => (
            <div key={`order-row-${idx}`} className="px-6 py-4 flex items-center justify-between">
              {/* Left Side Content: ID and Customer Meta */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton className="h-4 w-24 sm:w-28 rounded" />
                <Skeleton className="h-3.5 w-40 sm:w-48 rounded" />
              </div>
              
              {/* Right Side Content: Price and Status Pill */}
              <div className="flex flex-col items-end space-y-1.5 flex-shrink-0 pl-4">
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation CTA Bar */}
        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </div>

      {/* Recent Leads Card Skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Header Block */}
        <div className="px-6 py-4 border-b border-gray-100">
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Leads Row List (Simulates 5 Items) */}
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, idx) => (
            <div key={`lead-row-${idx}`} className="px-6 py-4 flex items-center justify-between">
              {/* Left Side Content: Name and Source Meta */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton className="h-4 w-32 sm:w-36 rounded" />
                <Skeleton className="h-3.5 w-44 sm:w-56 rounded" />
              </div>
              
              {/* Right Side Content: Just a Status Pill */}
              <div className="flex-shrink-0 pl-4">
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation CTA Bar */}
        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </div>

    </div>
  );
}