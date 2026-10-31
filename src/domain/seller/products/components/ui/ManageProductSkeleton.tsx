import { Skeleton } from "@/components/ui/Skeleton";

export function ManageProductSkeleton() {
 return (
  <div className="min-h-screen px-4 py-6 space-y-6 sm:px-6 lg:px-8 animate-pulse bg-gray-50 dark:bg-gray-900">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <Skeleton className="w-1/3 h-8 bg-gray-300/80 dark:bg-gray-700/80" />
      <Skeleton className="w-2/5 h-4 bg-gray-200/80 dark:bg-gray-800/80" />
    </div>

    {/* Filters Skeleton */}
    <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input Skeleton */}
        <div className="flex-1 min-w-[200px]">
          <Skeleton className="w-full h-10 rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
        </div>

        {/* Filter Controls Skeleton */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
          <Skeleton className="h-10 w-[180px] rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
          <Skeleton className="h-10 w-[180px] rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
          <Skeleton className="h-10 w-[180px] rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
        </div>
      </div>
    </div>

    {/* Bulk Actions Skeleton */}
    <div className="flex flex-col justify-between gap-4 sm:flex-row">
      <div className="flex space-x-2">
        <Skeleton className="w-6 h-6 rounded-md bg-gray-300/80 dark:bg-gray-700/80" />
        <Skeleton className="h-6 rounded-md w-28 bg-gray-300/80 dark:bg-gray-700/80" />
      </div>
      <Skeleton className="w-full rounded-md h-9 sm:w-80 bg-gray-300/80 dark:bg-gray-700/80" />
    </div>

    {/* Desktop Table Skeleton */}
    <div className="hidden overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm md:block dark:bg-gray-800 dark:border-gray-700">
      {/* Table Header Skeleton */}
      <div className="grid items-center grid-cols-7 px-6 py-3 bg-gray-100 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <Skeleton className="w-4 h-4 rounded bg-gray-300/80 dark:bg-gray-600/80" /> {/* Checkbox */}
        <Skeleton className="w-24 h-4 bg-gray-300/80 dark:bg-gray-600/80" /> {/* Name */}
        <Skeleton className="w-16 h-4 bg-gray-300/80 dark:bg-gray-600/80" /> {/* Price */}
        <Skeleton className="w-16 h-4 bg-gray-300/80 dark:bg-gray-600/80" /> {/* Stock */}
        <Skeleton className="w-24 h-4 bg-gray-300/80 dark:bg-gray-600/80" /> {/* Category */}
        <Skeleton className="w-20 h-4 bg-gray-300/80 dark:bg-gray-600/80" /> {/* Status */}
        <Skeleton className="w-16 h-4 bg-gray-300/80 dark:bg-gray-600/80 justify-self-end" /> {/* Actions */}
      </div>

      {/* Table Rows Skeleton */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="grid items-center grid-cols-7 gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-700"
        >
          {/* Checkbox */}
          <Skeleton className="w-4 h-4 rounded bg-gray-200/80 dark:bg-gray-700/80" />

          {/* Product Name (with image + text) */}
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 bg-gray-200/80 dark:bg-gray-700/80" />
              <Skeleton className="w-20 h-3 bg-gray-100/80 dark:bg-gray-800/80" />
            </div>
          </div>

          {/* Price */}
          <Skeleton className="w-12 h-4 bg-gray-200/80 dark:bg-gray-700/80" />

          {/* Stock */}
          <Skeleton className="w-10 h-4 bg-gray-200/80 dark:bg-gray-700/80" />

          {/* Category */}
          <Skeleton className="w-20 h-4 bg-gray-200/80 dark:bg-gray-700/80" />

          {/* Status Badge */}
          <Skeleton className="w-16 h-6 rounded-full bg-gray-200/80 dark:bg-gray-700/80" />

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Skeleton className="w-5 h-5 rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
            <Skeleton className="w-5 h-5 rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
          </div>
        </div>
      ))}
    </div>

    {/* Mobile Card Skeletons */}
    <div className="space-y-4 md:hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-2/3 h-4 bg-gray-200/80 dark:bg-gray-700/80" />
              <Skeleton className="w-1/3 h-3 bg-gray-100/80 dark:bg-gray-800/80" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Skeleton className="w-20 h-4 bg-gray-200/80 dark:bg-gray-700/80" />
            <Skeleton className="w-16 h-4 bg-gray-200/80 dark:bg-gray-700/80" />
            <Skeleton className="w-24 h-4 bg-gray-200/80 dark:bg-gray-700/80" />
            <Skeleton className="w-16 h-4 bg-gray-200/80 dark:bg-gray-700/80" />
          </div>

          <div className="flex justify-end pt-2 space-x-2">
            <Skeleton className="w-5 h-5 rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
            <Skeleton className="w-5 h-5 rounded-md bg-gray-200/80 dark:bg-gray-700/80" />
          </div>
        </div>
      ))}
    </div>

    {/* Pagination Skeleton */}
    <div className="flex justify-center space-x-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          className="w-8 h-8 rounded-md bg-gray-300/80 dark:bg-gray-700/80"
        />
      ))}
    </div>
  </div>
)
};
