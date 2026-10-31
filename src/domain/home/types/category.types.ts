import { BasicCategory } from "@/types";

export type Category = BasicCategory & {
  image: string;
  productCount?: number;
  isHero?: boolean;
  icon?: string;
  description?: string;
};

export type CategorySectionProps = {
  categories: Category[];
  title?: string;
  subtitle?: string;
  className?: string;
};

export type CategoryGridProps = {
  categories: Category[];
  className?: string;
};

export type CategoryCardProps = {
  category: Category;
  variant?: "hero" | "standard";
  className?: string;
};
