import { CategoryNature, CategoryStatus } from "@/constants";

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  banner?: string;
  icon?: string;
  nature: CategoryNature;
  requiresPayment: boolean;
  isFeatured: boolean;
  status: CategoryStatus;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metadata?: Record<string, any>;
  parent: string | null;
  allowedModes: Array<'PAL' | 'PAP'>;
  modeRules?: Record<string, any>;
  homepageRules?: Array<any>;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryFormData extends Omit<Category, '_id' | 'createdAt' | 'updatedAt'> {
  _id?: string;
}

export interface CategoryValidationErrors {
  name?: string;
  slug?: string;
  image?: string;
  parent?: string;
  allowedModes?: string;
  [key: string]: string | undefined;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  fields: string[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
  required?: string[];
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' ;