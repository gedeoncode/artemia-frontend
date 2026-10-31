"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product/product.types";
import { cn } from "@/lib";

interface ProductCardProps {
  product: Product;
  className?: string;
  onClick?: (product: Product) => void; // Optional analytics hook
}

export const ProductCard = ({
  product,
  className,
  onClick,
}: ProductCardProps) => {
  if (!product) return null;

  const imageUrl = product.images?.[0]?.url ?? "/placeholder-product.jpg";
  const hasDiscount =
    typeof product.discount === "number" && product.discount > 0;

  const handleClick = () => {
    onClick?.(product);
  };

  return (
    <Link
      href={`/product/${product._id}`}
      onClick={handleClick}
      className={cn("group block duration-300 bg-white/100 my-2", className)}
      role="article"
      aria-label={`View product: ${product.name}`}
    >
      {/* Image Container */}
      <div className="relative w-full overflow-hidden rounded-sm aspect-square">
        <Image
          src={imageUrl}
          alt={product.name || "Product image"}
          fill
          quality={85}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {hasDiscount && (
          <div className="absolute px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full shadow-sm top-2 left-2">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Title */}
      <h3
        className="mt-3 text-sm font-medium text-gray-900 line-clamp-2"
        title={product.name}
      >
        {product.name}
      </h3>

      <div className="flex items-center gap-2 mt-2">
        {product.price && (
          <span className="text-lg font-bold text-gradient">
            ${product.price.toFixed(2)}
          </span>
        )}

        {hasDiscount && product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock/Status */}
      {product.stock !== undefined && (
        <div className="mt-1">
          {product.stock > 0 ? (
            <span className="text-xs font-medium text-green-600">In stock</span>
          ) : (
            <span className="text-xs font-medium text-red-600">
              Out of stock
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
