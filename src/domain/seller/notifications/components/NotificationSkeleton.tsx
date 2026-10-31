import { Skeleton } from "@/components/ui/Skeleton";
import { PageSectionSkeleton } from "@/components/ui/skeletons/PageSectionSkeleton";

export function NotificationSkeleton() {
  return (
    <PageSectionSkeleton>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center animate-pulse">
        {/* Left side: Titles and Counts */}
        <div>
          {/* Skeleton for "Notifications" H1 */}
          <Skeleton className="w-56 bg-gray-200 h-7" />
          {/* Skeleton for count P tag */}
          <Skeleton className="w-32 h-4 mt-2 bg-gray-100" />
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Skeleton for "Refresh" Button */}
          <Skeleton className="h-9 w-[100px] rounded-md bg-gray-200" />

          {/* Skeleton for "Mark All Read" Button */}
          <Skeleton className="h-9 w-[130px] rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border shadow-sm rounded-xl border-neutral-200"
          >
            <div className="flex items-start gap-4 animate-pulse">
              {/* Skeleton Icon Placeholder */}
              <div className="flex-shrink-0 p-2 mt-1 bg-gray-200 rounded-lg w-9 h-9"></div>

              {/* Skeleton Content */}
              <div className="flex-1 min-w-0">
                {/* Title & Badge line */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3 max-w-[200px]"></div>
                  <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>

                {/* Message lines */}
                <div className="space-y-1">
                  <div className="w-full h-3 bg-gray-100 rounded"></div>
                  <div className="w-11/12 h-3 bg-gray-100 rounded"></div>
                </div>

                {/* Footer Row (Timestamp and Action Button) */}
                <div className="flex items-center justify-between pt-2 mt-4 border-t border-gray-100 border-dashed">
                  {/* Timestamp */}
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>

                  {/* Action Button/Status */}
                  <div className="h-8 bg-gray-200 rounded-lg min-w-[90px]"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageSectionSkeleton>
  );
}
