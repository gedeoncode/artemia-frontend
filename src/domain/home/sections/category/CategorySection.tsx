import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { CategoryGrid } from './CategoryGrid';
import { CategorySectionHeader } from './CategorySectionHeader';
import { CategorySectionSkeleton } from './CategorySectionSkeleton';
import { CategorySectionEmpty } from './CategorySectionEmpty';
import { CATEGORY_SECTION } from '../../constants/category.constants';
import type { CategorySectionProps } from '../../types/category.types';

export function CategorySection({
  categories,
  title = CATEGORY_SECTION.DEFAULT_TITLE,
  subtitle = CATEGORY_SECTION.DEFAULT_SUBTITLE,
  className,
}: CategorySectionProps) {
  // Empty state
  if (!categories || categories.length === 0) {
    return <CategorySectionEmpty />;
  }

  return (
    <section
      aria-labelledby="category-section-title"
      className={cn(
        'mx-auto layout-container py-8 lg:py-8',
        className
      )}
    >
      <div className="space-y-6 md:space-y-8">
        <CategorySectionHeader
          title={title}
          subtitle={subtitle}
          viewAllLink="/categories"
        />

        <Suspense fallback={<CategorySectionSkeleton />}>
          <CategoryGrid categories={categories} />
        </Suspense>
      </div>
    </section>
  );
}
