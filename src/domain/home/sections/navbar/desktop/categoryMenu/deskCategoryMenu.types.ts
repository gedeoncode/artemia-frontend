import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";

export type FeaturedCategoryLink = {
  label: string;
  href: string;
};

export type CategoryMenuAnalyticsEvent =
  | {
      type: "hover";
      categoryId: string;
      categoryName: string;
      level: number;
    }
  | {
      type: "open";
      categoryId: string;
      categoryName: string;
      level: number;
    }
  | {
      type: "click";
      categoryId: string;
      categoryName: string;
      level: number;
    };

export type CategoryMenuAnalyticsHandler = (
  event: CategoryMenuAnalyticsEvent,
) => void;

export type CategoryMenuConfig = {
  hoverIntentDelay?: number;
  persistLastPath?: boolean;
  quickCategories?: CategoryNode[];
  storageKey?: string;
  getCategoryHref?: (category: CategoryNode) => string;
  getFeaturedLinks?: (category: CategoryNode | null) => FeaturedCategoryLink[];
  onAnalyticsEvent?: CategoryMenuAnalyticsHandler;
};
