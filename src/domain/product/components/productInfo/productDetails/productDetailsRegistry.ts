import { ComponentType } from "react";
import { ProductDetails } from "@/types/product";
import { CarDetailsView, RealEstateDetailsView } from "./views";

type Registry = Partial<{
  [K in ProductDetails["categoryType"]]: ComponentType<{
    details: Extract<ProductDetails, { categoryType: K }>;
  }>;
}>;

export const productDetailsRegistry: Registry = {
  car: CarDetailsView,
  real_estate: RealEstateDetailsView,
};
