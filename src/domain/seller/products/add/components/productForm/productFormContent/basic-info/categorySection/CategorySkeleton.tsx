import { Skeleton } from "@/components/ui";

/* ------------------------- Skeleton Loader ------------------------- */
export const CategorySkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-2 py-2">
        <Skeleton className="w-5 h-5 rounded-md" />
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 rounded w-3/4" />
          <Skeleton className="h-3 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);