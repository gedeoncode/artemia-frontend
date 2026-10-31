import { CategoryAttribute } from "./CategoryAttribute.types";

export type CommissionModel = "PAP" | "PAL";

export interface CommissionRule {
  commissionRate: number; // e.g., 0.1 for 10%
  minFee: number;
  maxFee: number;
}

export interface ModeRules {
  PAP: CommissionRule;
  PAL: CommissionRule;
}

export type CategoryStatus = "active" | "inactive" | "archived";
export type CategoryType =
  | "product"
  | "digital"
  | "service"
  | "vehicle"
  | "property"
  | "space"
  | "mixed";

export interface BasicCategory {
  _id: string;
  name: string;
  slug: string;
  code: string;
}

export interface Subcategory extends BasicCategory {
  type: CategoryType;
  nature: CategoryType;
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
  nature: CategoryType;
  image: string;
  type: CategoryType;
  status: CategoryStatus;
  isFeatured: boolean;
  requiresPayment: boolean;
  level: number;
  metadata: Record<string, any>;
  attributes: CategoryAttribute[];
  modeRules: ModeRules;
  allowedModes: CommissionModel[];
  detailsSchema: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  descendantCount?: number;
  children?: Category[];
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
  };
}
