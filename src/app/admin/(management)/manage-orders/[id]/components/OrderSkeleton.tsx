import { Skeleton } from "@/components/ui/Skeleton";
export function OrderDetailsSkeleton() {
  return (
    <div className="p-6 mx-auto space-y-6 max-w-7xl">
      <Skeleton className="h-8 w-[200px]" />
      <div className="space-y-4">
        <Skeleton className="w-full h-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
        </div>
        <Skeleton className="w-full h-64" />
      </div>
    </div>
  );
}
