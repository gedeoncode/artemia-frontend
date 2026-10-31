"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product/product.types";
import { cn, smartTruncate } from "@/lib";

interface Props {
  product: Product;
  className?: string;
  onClick?: (product: Product) => void;
}

export const ProductRow = ({ product, className, onClick }: Props) => {
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
      className={cn("flex gap-4 items-start py-3 border-b group", className)}
      role="article"
      aria-label={`View product: ${product.name}`}
    >
      {/* 🔵 Image */}
      <div className="relative flex-shrink-0 w-32 h-32 overflow-hidden bg-white rounded-sm">
        <Image
          src={imageUrl}
          alt={product.name || "Product image"}
          fill
          quality={85}
          sizes="120px"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {hasDiscount && (
          <div className="absolute px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded top-1 left-1">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* 🟣 Info */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Title */}
        <h3 className="text-sm font-medium leading-tight text-gray-900 text-fade">
          {smartTruncate(product.name, 60)}
        </h3>
        {/* Optional description (if exists in your model) */}
        {product.description && (
          <p className="mt-1 text-xs leading-snug text-gray-500 text-fade">
            {smartTruncate(product.description, 90)}
          </p>
        )}
        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-gray-900">
            ${product.price?.toFixed(2)}
          </span>

          {hasDiscount && product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock */}
        {product.stock !== undefined && (
          <div className="mt-1">
            {product.stock > 0 ? (
              <span className="text-xs font-medium text-green-600">
                In stock
              </span>
            ) : (
              <span className="text-xs font-medium text-red-600">
                Out of stock
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
