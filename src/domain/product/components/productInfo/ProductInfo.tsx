import { Price } from "../ui/Price";
import { ActionButtons, ShareButtons } from ".";
import { Rating } from "../ui";
import { Product } from "@/types/product/product.types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  // --- Safe destructuring ---
  const {
    _id: rawProductId,
    name,
    brand,
    price,
    discountedPrice,
    rating,
    reviewCount,
    description,
    details = [],
    seller,
    category,
    images = [],
    stock,
  } = product;

  // Sellers may come as: null, undefined, object, or string ID
  let sellerId = "";
  let sellerName = "";

  if (seller && typeof seller === "object") {
    sellerId = seller._id || "";
    sellerName = seller.name || "";
  } else if (typeof seller === "string") {
    sellerId = seller; // backend only sent ID
  }

  // Image fallback
  const image = Array.isArray(images) && images.length > 0 ? images[0] : "";

  const actionButtonProduct = {
    productId: rawProductId,
    name,
    price: discountedPrice ?? price,
    stock: stock ?? 0,
    image,
    sellerId,
    sellerName,
    category,
  };
  return (
    <div className="space-y-6">
      {/* Title & Brand */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        {brand && (
          <p className="mt-1 text-sm text-gray-500">Marque : {brand}</p>
        )}
      </div>

      {/* Rating */}
      <Rating rating={rating} reviewCount={reviewCount} />

      {/* Price */}
      <Price price={price} discountedPrice={discountedPrice} />

      {/* Description */}
      {description && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">À propos de cet article</h2>
          <p className="text-gray-700">{description}</p>
        </div>
      )}

      {/* Action Buttons */}
      <ActionButtons product={actionButtonProduct} />

      {/* Details + Share */}
      <div className="pt-4 border-t border-gray-200">
        {details.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Détails du produit</h2>
            <ul className="pl-5 mt-2 text-gray-700 list-disc">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        <ShareButtons product={product} />
      </div>
    </div>
  );
}
