import { Skeleton } from "@/components/ui/";

export function InsightsPanelSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" aria-hidden="true">
      {/* Header Container */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          
          {/* Header Title + Beta Label */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-md" />
            <Skeleton className="h-5 w-24 sm:h-6 sm:w-28" />
            <Skeleton className="h-4 w-10 rounded-full" />
          </div>
          
          {/* Carousel Navigation Indicator Dots */}
          <div className="flex gap-1.5 py-2 sm:py-0">
            <Skeleton className="bg-blue-200 w-3 sm:w-4 h-1.5 sm:h-2 rounded-full" />
            <Skeleton className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full" />
            <Skeleton className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Primary Carousel Active Element Container View */}
      <div className="p-3 sm:p-6">
        {/* Mirrors priority card layout borders with left border structure mock */}
        <div className="border-l-4 border-gray-200 pl-2 sm:pl-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            
            {/* Status Type Icon Dot Placeholder */}
            <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
            
            <div className="flex-1 space-y-2.5 min-w-0">
              {/* Card Meta Row: Title Text & Priority Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Skeleton className="h-4.5 w-1/2 sm:w-2/3" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              
              {/* Narrative Content lines block description */}
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-11/12" />
                <Skeleton className="h-3.5 w-4/5 hidden sm:block" />
              </div>
              
              {/* Metric Breakdown Wrapper */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center space-x-1.5">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex items-center space-x-1">
                  <Skeleton className="w-3 h-3 rounded" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>

              {/* Functional CTA Button Hyperlink Segment */}
              <div className="pt-1">
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Bottom Collapsible Drawer Toggle Button Mock */}
      <div className="border-t border-gray-200">
        <div className="px-4 sm:px-6 py-2.5 sm:py-3">
          <Skeleton className="h-4 w-36 sm:w-40" />
        </div>
      </div>
    </div>
  );
}