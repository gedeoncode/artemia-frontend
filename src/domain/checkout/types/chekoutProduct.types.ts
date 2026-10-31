import { CurrencyCode } from "@/types/product";

export interface CheckoutPricing {
  price: number;
  currency: CurrencyCode
}

export interface CheckoutProduct {
  _id: string;
  name: string;
  images: string[];
  stock: number;
  pricing: CheckoutPricing;
}

export interface CheckoutProductResponse {
  product: CheckoutProduct;
}