// /ui/layouts/DefaultLayout.tsx


import { ProductDetailsRenderer } from "../ProductDetailsRenderer";
import { Rating } from "../../../ui/Rating";
import { Price } from "../../../ui/Price";
import { ActionButtons } from "../..";
import { UIProduct } from "@/domain/product/types";
type Props = {
  product: UIProduct;
};
export function DefaultLayout({ product }: Props) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
      <Rating
        rating={product.rating.average}
        reviewCount={product.rating.count}
      />
      <Price
        price={product?.pricing?.price}
        discountedPrice={product?.pricing?.discountedPrice}
      />

      {/* Description */}
      {product.description && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">À propos de cet article</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>
      )}
      {/* Action Buttons */}
      <ActionButtons product={product} />
      <ProductDetailsRenderer details={product.details} />
    </div>
  );
}
