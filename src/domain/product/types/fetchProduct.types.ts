import { BaseProduct } from "@/types/product/product.types";
import { UIProduct } from "./uiProduct.types";
import { Review } from "./reviews";

export interface FetchProductByIdResponse {
  product: UIProduct;
  reviews: Review[];
  similarProducts: BaseProduct[];
}
