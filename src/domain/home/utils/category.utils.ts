import { Category } from '../types/category.types';
import { CATEGORY_SECTION } from '../constants/category.constants';

export const getHeroCategories = (categories: Category[]): Category[] => {
  return categories
    .filter(cat => cat.isHero)
    .slice(0, CATEGORY_SECTION.HERO_COUNT);
};

export const getStandardCategories = (categories: Category[]): Category[] => {
  return categories.filter(cat => !cat.isHero);
};

export const formatProductCount = (count?: number): string => {
  if (!count) return '';
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k+ products`;
  }
  return `${count} products`;
};

export const getGridColumns = (total: number, isHero?: boolean): string => {
  if (isHero) return 'md:col-span-2 lg:col-span-2';
  
  if (total <= 4) return 'sm:col-span-2 md:col-span-1';
  if (total <= 8) return 'sm:col-span-2 md:col-span-1 lg:col-span-1';
  
  return 'sm:col-span-2 md:col-span-1 lg:col-span-1';
};