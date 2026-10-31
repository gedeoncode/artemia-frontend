import { cn } from '@/lib/utils';

export function CategorySectionSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700 md:h-10 md:w-64" />
        <div className="h-4 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {/* Hero skeleton (2 slots) */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <CategoryCardSkeleton variant="hero" />
        </div>
        
        {/* Standard skeletons */}
        {Array.from({ length: 8 }).map((_, index) => (
          <CategoryCardSkeleton key={index} variant="standard" />
        ))}
      </div>
    </div>
  );
}

function CategoryCardSkeleton({ variant = 'standard' }: { variant?: 'hero' | 'standard' }) {
  const isHero = variant === 'hero';
  
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800',
      'animate-pulse',
      isHero ? 'aspect-[4/3]' : 'aspect-square'
    )}>
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-300/50 to-transparent dark:from-neutral-700/50" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 space-y-2">
        <div className={cn(
          'h-4 rounded bg-neutral-300 dark:bg-neutral-700',
          isHero ? 'w-3/4 md:h-6' : 'w-2/3'
        )} />
        <div className="h-3 w-1/2 rounded bg-neutral-300 dark:bg-neutral-700" />
      </div>
    </div>
  );
}