// Stats Skeleton component
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="p-2 mr-3 bg-gray-200 rounded-lg animate-pulse w-9 h-9"></div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
