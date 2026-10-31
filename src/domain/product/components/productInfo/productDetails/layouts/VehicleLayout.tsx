// /ui/layouts/VehicleLayout.tsx

import { ProductDetailsRenderer } from "../ProductDetailsRenderer";
import { Price } from "../../../ui/Price";
import { Rating } from "../../../ui";
import { UIProduct } from "@/domain/product/types";
import { ActionButtons } from "../..";
type Props = {
  product: UIProduct;
};
export function VehicleLayout({ product }: Props) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

      <Rating
        rating={product.rating.average}
        reviewCount={product.rating.count}
      />

      <Price
        price={product.pricing.price}
        discountedPrice={product.pricing.discountedPrice}
      />
      {/* Description */}
      {product.description && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">À propos de cet article</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>
      )}
      <ActionButtons product={product} />

      <ProductDetailsRenderer details={product.details} />
    </div>
  );
}
