export const RelatedProductsSkeleton = () => (
  <div className="mt-8">
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
      ))}
    </div>
  </div>
);