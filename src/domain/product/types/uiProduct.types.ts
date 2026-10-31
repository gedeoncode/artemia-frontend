// /types/uiProduct.ts

import { ImageData } from "@/types";

// =====================================================
// PRICE
// =====================================================
export interface ProductPricing {
  originalPriceMinor?: number;
  currentPriceMinor?: number;
  currencyCode?: string;
  effectivePriceMinor?: number;
}

// =====================================================
// AVAILABILITY
// =====================================================
export interface ProductAvailability {
  inStock: boolean;
  quantity: number;

  status: "in_stock" | "low_stock" | "out_of_stock" | "preorder";

  isPurchasable: boolean;
}

// =====================================================
// SELLER
// =====================================================
export interface SellerInfo {
  _id: string;

  businessName?: string;
  sellerType?: string;

  user?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };

  rating?: number;

  // optional because backend currently doesn't return them
  totalReviews?: number;
  location?: string;

  verified?: boolean;

  since?: string | Date;

  responseTime?: string;

  onlineSince?: string | Date;
}

// =====================================================
// TRUST SIGNALS (UI ONLY)
// =====================================================
export interface TrustSignal {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// =====================================================
// VARIANTS (UI LAYER - NOT IN BACKEND YET)
// =====================================================
export interface ProductVariant {
  id: string;
  name: string;
  value: string;

  price?: ProductPricing;
  inStock?: boolean;
}

// =====================================================
// REVIEWS (MAPPED FROM ProductReview MODEL)
// =====================================================
export interface ProductReview {
  id: string;

  userId: string;
  userName: string;

  rating: number;

  content: string;

  date: string;

  verifiedPurchase: boolean;

  helpful?: number;

  images?: string[];

  responses?: ProductReviewResponse[];
}

// =====================================================
// REVIEW RESPONSES (FUTURE FEATURE)
// =====================================================
export interface ProductReviewResponse {
  id: string;
  userId: string;
  userName: string;

  content: string;

  date: string;
}

// =====================================================
// SPECIFICATIONS (maps to Product.details)
// =====================================================
export interface ProductSpecification {
  name: string;
  value: string;
}

// =====================================================
// SHIPPING (maps to Product.shipping)
// =====================================================
export interface ShippingInfo {
  location?: {
    country?: string;

    province?: string;
    city?: string;
    commune?: string;
    quartier?: string;
    avenue?: string;

    geo?: {
      lat?: number;
      lng?: number;
    };
  };
}

// =====================================================
// RETURNS (NOT IN BACKEND YET - UI CONTRACT)
// =====================================================
export interface ReturnPolicy {
  days: number;
  cost: string;
  condition: string;
  refundMethod: string;
}
export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  nature?: string;
  allowedModes?: string[];
}

export interface UIProduct {
  _id: string;
  id?: string;

  name: string;

  description?: string;
  shortDescription?: string;

  images?: ImageData[];

  availability: ProductAvailability;
  category?: ProductCategory;

  seller?: SellerInfo;

  pricing?: ProductPricing;

  stock?: number;

  inventoryStatus?: string;

  isPurchasable?: boolean;

  shipping?: ShippingInfo;

  reviewCount?: number;

  rating?: number;

  // adapter expects this, but backend aggregation currently doesn't project it
  details: ProductSpecification[];

  createdAt?: string | Date;

  updatedAt?: string | Date;
}
