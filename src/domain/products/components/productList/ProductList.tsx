"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product/product.types";
import { NoProductSVG } from "../ui";

type Props = {
  products: Product[];
};

export function ProductList({ products }: Props) {
  if (!products || products.length === 0) {
    return (
      <div className="">
        <NoProductSVG />
      </div>
    );
  }

  // Deduplicate products by _id
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product._id, product])).values(),
  );

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {uniqueProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
