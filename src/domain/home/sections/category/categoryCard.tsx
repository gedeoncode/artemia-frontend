'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CategoryImage } from './categoryImage';
import { formatProductCount } from '../../utils/category.utils';
import type { CategoryCardProps } from '../../types/category.types';
import { getCategoryUrl } from '../navbar';

export function CategoryCard({ 
  category, 
  variant = 'standard',
  className 
}: CategoryCardProps) {
  const { name, image, productCount, description } = category;
  const isHero = variant === 'hero';

  return (
    <Link
      href={getCategoryUrl(category)}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'bg-white dark:bg-neutral-900',
        'transition-all duration-300 ease-out',
        'hover:shadow-2xl hover:-translate-y-1',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        isHero ? 'col-span-2 row-span-2' : 'col-span-1',
        className
      )}
    >
      <CategoryImage
        src={image}
        alt={name}
        aspectRatio={isHero ? 'aspect-[4/3]' : 'aspect-square'}
        priority={isHero}
        className={cn(
          'transition-transform duration-500 ease-out',
          'group-hover:scale-105'
        )}
      />
      

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <h3 className={cn(
          'font-bold text-white drop-shadow-lg',
          isHero ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg md:text-xl'
        )}>
          {name}
        </h3>

        {description && isHero && (
          <p className="mt-1 text-sm text-white/80 drop-shadow-lg line-clamp-2">
            {description}
          </p>
        )}

        {productCount !== undefined && (
          <p className={cn(
            'text-white/70 drop-shadow-lg',
            isHero ? 'text-sm md:text-base' : 'text-xs md:text-sm'
          )}>
            {formatProductCount(productCount)}
          </p>
        )}

        <div className={cn(
          'mt-2 inline-flex items-center gap-1 text-white/90 font-medium',
          'transition-all duration-300',
          'group-hover:gap-2 group-hover:text-white'
        )}>
          <span className="text-xs md:text-sm">Browse</span>
          <svg
            className="h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
        </div>
      </div>
    </Link>
  );
}