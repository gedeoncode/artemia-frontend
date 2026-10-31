export type CategoryStatus = "active" | "inactive" | "archived";
export type CategoryType = "physical" | "digital" | "service";

export interface BasicCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  type: CategoryType;
  status: CategoryStatus;
}

export interface Subcategory extends BasicCategory {
  type: CategoryType;
  status: CategoryStatus;
  isFeatured: boolean;
  requiresPayment: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  subcategories?: Subcategory[]; // Recursive
}

export interface Category extends BasicCategory {
  parent?: BasicCategory;
  description: string;

  requiresPayment: boolean;
  isFeatured: boolean;
  level: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  descendantCount?: number;
  subcategories?: Category[];
  allowedModes: string[];
  modeRules: Record<string, any>;
  homepageRules: HomepageRule[];
}

export interface TypeCategoryFilters {
  search?: string;
  status?: CategoryStatus;
  type?: string;
  isFeatured?: boolean;
  parent?: string | null;
  level?: number;
  page?: number;
  sortBy?: string;
}

export interface CategoryData {
  data: Category[];
  meta: {
    total: number;
    totalPages: number;
  };
}

export interface CategoryTableProps {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onStatusChange?: () => Promise<void> | void;
  onRefresh?: () => void;
  renderSkeleton: () => React.ReactNode;
  isLoading: boolean;
}

// Types for Homepage Rules

export type HomepageRuleType =
  | "topDeals"
  | "bestSellers"
  | "newArrivals"
  | "trending"
  | "mostViewed"
  | "highDiscount";

export interface HomepageRule {
  ruleType: HomepageRuleType;
  limit: number;
  link?: string;
}
