export  function Loading() {
  return (
    <div className="px-4 pt-6 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Skeleton Heading */}
      <div className="w-40 h-6 rounded bg-muted animate-pulse" />
      <div className="w-64 h-4 mt-2 rounded bg-muted animate-pulse" />

      <div className="grid grid-cols-1 gap-10 mt-8 md:grid-cols-[280px_1fr]">
        {/* Sidebar skeleton */}
        <div className="hidden md:block">
          <div className="rounded h-80 bg-muted animate-pulse" />
        </div>

        {/* Product Skeleton Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
