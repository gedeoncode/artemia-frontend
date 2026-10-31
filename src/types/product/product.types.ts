// ======================
// Shared Types
// ======================

import { CategoryNature } from "@/constants";
import { BasicCategory } from "../category/category.types";
import { Images } from "../image.types";

export type CurrencyCode = "CDF" | "USD";

export type ProductStatus =
  | "activated"
  | "pending"
  | "pending_payment"
  | "deleted"
  | "draft"
  | "archived"
  | "out_of_stock";

export type CommissionModel = "PAP" | "PAL";

// ======================
// Pricing
// ======================

export interface ProductPricing {
  priceMinor?: number;
  discountPrice?: number;
  originalPrice?: number;
  dealPrice?: number;
  listingFeeMinor?: number;
  currencyCode?: CurrencyCode;
}

// ======================
// Images
// ======================

export interface ProductImage {
  url: string;
  thumbnailUrl: string;
  publicId: string;
  isPrimary?: boolean;
}

// ======================
// Ratings
// ======================

export interface ProductRating {
  user: string;
  score: number;
  comment?: string;
  createdAt?: string;
}

// ======================
// Inventory
// ======================

export interface ProductInventory {
  stock: number;
  quantity: number;
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  sales: number;
}

// ======================
// Shipping
// ======================

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "m" | "in" | "ft";
}

export interface ProductShipping {
  weight: number;

  dimensions: ProductDimensions;

  handoverMethod?: "pickup" | "dropoff";

  pickupLocation?: string;

  dropoffHub?: string;

  customDropoffNote?: string;

  deliveryMethod?: "own_delivery" | "pickup" | "courier";

  estimatedTime?: string;

  countryOfOrigin?: string;
}

// ======================
// Seller
// ======================

export interface ProductSeller {
  _id: string;
  name?: string;
  phoneNumber?: string;
}

// ======================
// Category
// ======================

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  nature?: CategoryNature;
}

// ======================
// Category-Specific Details
// ======================

export interface CarDetails {
  categoryType: "car";

  brand: string;

  model: string;

  year: number;

  mileage?: number;

  fuelType?: "essence" | "diesel" | "hybride" | "électrique";

  transmission?: "automatique" | "manuelle";

  condition?: "neuf" | "bon" | "usé";
}

export interface RealEstateDetails {
  categoryType: "real_estate";

  location: string;

  surface: number;

  rooms: number;

  price: number;

  propertyType?: "appartement" | "maison" | "terrain" | "bureau" | "autre";
}

// Future:
// ElectronicsDetails
// FashionDetails
// etc...

export type ProductDetails =
  | CarDetails
  | RealEstateDetails
  | { categoryType: "unknown"; [key: string]: any };

// ======================
// Base Product
// ======================

export interface BaseProduct {
  id: string;

  _id?: string;

  name: string;

  description?: string;

  shortDescription?: string;

  pricing: ProductPricing;

  images: ProductImage[];

  category: ProductCategory;

  seller: ProductSeller;

  inventory: ProductInventory;

  ratings: ProductRating[];

  commissionModel: CommissionModel;

  shipping?: ProductShipping;

  details: ProductDetails;

  physicalProduct: boolean;

  isFeatured: boolean;

  isDeal: boolean;

  isNew: boolean;

  status: ProductStatus;

  createdAt?: string;

  updatedAt?: string;
}

export interface ProductSummary {
  _id: string;

  name: string;

  images: Images;

  price: number;

  description: string;

  category?: BasicCategory;
}

export interface ProductCardData {
  _id: string;

  name: string;

  images: Images;

  price: number;
}
