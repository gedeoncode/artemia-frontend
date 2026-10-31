import Separator from "@/components/ui/Separator";
import { Skeleton } from "@/components/ui/Skeleton";
export function CategorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-64 h-8" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <Separator />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Skeleton className="w-full h-80" />
        </div>
        <div className="space-y-6">
          <Skeleton className="w-full h-60" />
          <Skeleton className="w-full h-60" />
        </div>
      </div>
      <Skeleton className="w-full h-96" />
    </div>
  );
}
