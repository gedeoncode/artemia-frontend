import { ProductCardData } from "@/types/product";
import { BannerData } from "./banner.types";
import { Category } from "./category.types";

export interface HomeProductsResponse {
  data: HomePageData;
}
export interface Sections {
  featuredProducts: ProductSection;
  newArrivals: ProductSection;
  popularProducts: ProductSection;
  deals: ProductSection;
}
export interface HomePageData {
  banners: BannerData[];
  sideBanners: BannerData[];
  categories: Category[];
  sections: Sections[];

  generatedAt: string;
}

export interface ProductSection {
  title: string;
  link: string;
  products: ProductCardData[];
}
export interface ProductSectionsResponse {
  data: HomePageData;
  success: boolean;
}
