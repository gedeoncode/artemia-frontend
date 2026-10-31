import { Skeleton } from "@/components/ui/";

export function InventoryAlertsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" aria-hidden="true">
      {/* Header Container Block */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-32 sm:w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="w-5 h-5 rounded" />
          </div>
        </div>
      </div>

      {/* Expanded Layout List Blocks Wrapper */}
      <div className="divide-y divide-gray-200">
        
        {/* Mocked System Alert Card: High Severity (Left Accent Border Block) */}
        <div className="p-6 bg-gray-50/40 border-l-8 border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="h-4.5 w-40 sm:w-48" />
              </div>
              <Skeleton className="h-3.5 w-52 sm:w-64" />
              
              {/* Nested Product Items List inside Alert block */}
              <div className="mt-3 space-y-2.5 pt-1">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-3.5 w-16" />
                      <Skeleton className="h-3.5 w-12 hidden sm:block" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-5 w-14 rounded-full flex-shrink-0" />
          </div>
        </div>

        {/* Low Stock Subheader Banner Layout */}
        <div className="px-6 py-3 bg-gray-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
        </div>

        {/* Low Stock Traditional Product Row Items */}
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="p-6 space-y-3">
            <div className="flex items-start space-x-4">
              
              {/* Thumbnail Media Box Wrapper */}
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
              
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 w-full">
                    <Skeleton className="h-4.5 w-1/2 sm:w-1/3" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                  {/* Action Selection Checkbox Slot */}
                  <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
                </div>
                
                {/* Meta details status bar alignment rows */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="w-3.5 h-3.5 rounded" />
                  </div>
                </div>

                {/* Micro Linear Level Indicator Bar */}
                <Skeleton className="h-2 w-full rounded-full mt-2" />
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}