import { Skeleton } from "@/components/ui/";

interface ChartWidgetSkeletonProps {
  height?: number;
  enableZoom?: boolean;
}

export function ChartWidgetSkeleton({ 
  height = 400, 
  enableZoom = false 
}: ChartWidgetSkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" aria-hidden="true">
      {/* Header Container */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          
          {/* Title Placeholder */}
          <Skeleton className="h-5 w-40 sm:h-6 sm:w-48" />
          
          {/* Action Header Controls Wrapper */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mocking Time Range Buttons */}
            <div className="flex rounded-md shadow-sm">
              {[...Array(4)].map((_, idx) => (
                <Skeleton 
                  key={idx} 
                  className="h-8 w-11 sm:w-12 rounded-none border border-gray-100 first:rounded-l-md last:rounded-r-md" 
                />
              ))}
            </div>
            
            {/* Optional Zoom Blocks Placeholder */}
            {enableZoom && (
              <div className="flex rounded-md shadow-sm">
                <Skeleton className="h-8 w-8 rounded-none rounded-l-md" />
                <Skeleton className="h-8 w-8 rounded-none rounded-r-md border-l border-white" />
              </div>
            )}
            
            {/* Export Action Button Placeholder */}
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

        </div>
      </div>
      
      {/* Dynamic Graph Matrix Core Spacer */}
      <div className="p-3 sm:p-4">
        {/* Uses a CSS variable block mapping directly to pass along custom desktop heights safely */}
        <div 
          style={{ '--desktop-height': `${height}px` } as React.CSSProperties}
          className="w-full flex items-end justify-between h-[280px] md:h-[32px] lg:h-[var(--desktop-height)] max-h-[var(--desktop-height)] pt-4 px-2"
        >
          {/* Loop creates a realistic fake bar/line waveform layout pattern using diverse heights */}
          {[...Array(12)].map((_, idx) => {
            const patternHeights = ['h-[40%]', 'h-[65%]', 'h-[50%]', 'h-[85%]', 'h-[30%]', 'h-[70%]'];
            return (
              <Skeleton 
                key={idx} 
                className={`w-[6%] sm:w-[5%] ${patternHeights[idx % patternHeights.length]} rounded-t opacity-60`} 
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Zoom Range Slider Brush Container Mockup */}
      {enableZoom && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 hidden md:block">
          <Skeleton className="h-[25%] lg:h-[30px] w-full rounded" />
        </div>
      )}
    </div>
  );
}