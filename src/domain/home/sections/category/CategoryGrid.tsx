import { cn } from '@/lib/utils';
import { CategoryCard } from './categoryCard';
import { getHeroCategories, getStandardCategories } from '../../utils/category.utils';
import type { CategoryGridProps } from '../../types/category.types';

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  if (categories.length === 0) return null;

  const heroCategories = getHeroCategories(categories);
  const standardCategories = getStandardCategories(categories);

  return (
    <div className={cn(
      'grid grid-cols-2 gap-3 md:gap-4 lg:gap-5',
      'sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
      className
    )}>
      {/* Hero Categories - Span 2 columns on larger screens */}
      {heroCategories.map((category) => (
        <div key={category.id} className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <CategoryCard category={category} variant="hero" />
        </div>
      ))}

      {/* Standard Categories */}
      {standardCategories.map((category) => (
        <CategoryCard key={category.id} category={category} variant="standard" />
      ))}
    </div>
  );
}