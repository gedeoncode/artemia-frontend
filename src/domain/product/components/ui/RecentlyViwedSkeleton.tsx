
// Skeleton components for loading states
export const RecentlyViewedSkeleton = () => (
  <div className="mt-8">
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-100 rounded-lg animate-pulse"
        />
      ))}
    </div>
  </div>
);
