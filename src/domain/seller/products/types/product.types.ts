import { ProductCategory as CategoryType } from "@/schemas/category.schema";
import { ProductFormSchema } from "@/schemas/product/product.schema";
import { ProductDisplayStatus } from "./filter.types";
import { ProductSummary } from "@/types/product";
export interface Product extends ProductSummary {
  originalPrice: number;

  currency: string;

  stock: number;

  sales: number;

  primaryImage: string | null;

  displayStatus: ProductDisplayStatus;

  inventoryStatus: string;
}

export type ProductListResponse = {
  products: ProductFormData[];
  pagination: {
    page: number;
    total: number;
    pages: number;
  };
};
// ======================
// 🔹 Category Detail Types
// ======================

export interface HouseDetails {
  brand: string;
  model?: string;
  year?: number;
  condition?: "neuf" | "comme_neuf" | "bon" | "usé";
}

export interface RealEstateDetails {
  location: string;
  surface: number;
  rooms: number;
  price: number;
  propertyType?: "appartement" | "maison" | "terrain" | "bureau" | "autre";
}

export interface CarDetails {
  brand: string;
  model: string;
  year: number;
  mileage?: number;
  fuelType?: "essence" | "diesel" | "hybride" | "électrique";
  transmission?: "automatique" | "manuelle";
  condition?: "neuf" | "bon" | "usé";
}

export interface ElectronicsDetails {
  brand: string;
  model?: string;
  warranty?: string;
  condition?: "neuf" | "reconditionné" | "usé";
  color?: string;
}

export interface BooksDetails {
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  language?: string;
  pages?: number;
  condition?: "neuf" | "comme_neuf" | "bon" | "usé";
}

export interface FashionDetails {
  brand: string;
  productType: "vetement" | "chaussure" | "sac" | "accessoire";
  size?: string;
  color?: string;
  gender?: "homme" | "femme" | "enfant" | "unisexe";
  condition?: "neuf" | "comme_neuf" | "bon" | "usé";
  material?: string;
}

// ======================
// 🔹 Generic Details Fallback
// ======================
export interface GenericDetails {
  sku?: string;
  barcode?: string;
  costPerItem?: number;
  taxStatus?: "taxable" | "shipping" | "none";
  taxCode?: string;
  countryOfOrigin?: string;
  hsCode?: string;
  seoTitle?: string;
  seoDescription?: string;
  [key: string]: string | number | boolean | undefined;
}

// ======================
// 🔹 Discriminated Union
// ======================

export type CategoryDetails =
  | ({ category: "house" } & HouseDetails)
  | ({ category: "real_estate" } & RealEstateDetails)
  | ({ category: "car" } & CarDetails)
  | ({ category: "electronics" } & ElectronicsDetails)
  | ({ category: "books" } & BooksDetails)
  | ({ category: "mode" } & FashionDetails)
  | ({ category: string } & GenericDetails); // fallback

// ======================
// 🔹 Product Form Data
// ======================

export type ProductFormData = ProductFormSchema;

export type ProductVariant = {
  id?: string;
  option: string;
  values: string[];
  price?: number;
  sku?: string;
  quantity?: number;
};

export type ProductCategory = CategoryType;
export type UploadStatus = {
  fileName: string;
  progress: number;
  error?: string;
  publicId?: string;
};

export type MediaSectionProps = {
  images: ImageData[];
  onImagesUpload: (files: File[]) => Promise<void>;
  onImageRemove: (publicId: string) => void;
  loading?: boolean;
  uploadStatuses?: UploadStatus[];
};
export type ProductRating = {
  user: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type PaymentSessionResponse = {
  sessionId: string;
  product: Product;
};
