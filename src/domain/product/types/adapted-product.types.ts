
import { ProductAvailability, ProductSpecification, ShippingInfo } from "./uiProduct.types";
import { ProductCategory } from "@/types/product";

export interface AdaptedProduct {
  id: string;

  name: string;

  description?: string;

  shortDescription?: string;

  price: AdaptedProductPrice;

  rating: number;

  reviewCount: number;

  seller: AdaptedSeller | null;

  category?: ProductCategory;

  images: string[];

  stock: number;

  availability: ProductAvailability;

  shipping?: ShippingInfo;

  details?: ProductSpecification[];
}

export interface AdaptedSeller {
  id: string;

  name?: string;

  email?: string;

  phone?: string;

  businessName?: string;

  sellerType?: string;

  rating: number;

  totalReviews: number;

  verified: boolean;

  location?: string;

  since?: string;

  responseTime?: string;

  onlineSince?: string;
}
export interface AdaptedProductPrice {
  current: number;

  original: number;

  currency: string;

  effective: number;

  discount?: {
    amount: number;

    percentage: number;
  };
}

