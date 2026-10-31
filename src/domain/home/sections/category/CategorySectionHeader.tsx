import { cn } from '@/lib/utils';

interface CategorySectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  viewAllLink?: string;
}

export function CategorySectionHeader({
  title,
  subtitle,
  className,
  viewAllLink,
}: CategorySectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between', className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      
      {viewAllLink && (
        <a
          href={viewAllLink}
          className="hidden text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 md:inline-flex items-center gap-1 transition-colors"
        >
          View all categories
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      )}
    </div>
  );
}