"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product/product.types";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        (((product.oldPrice as number) - product.price) /
          (product.oldPrice as number)) *
          100,
      )
    : 0;
  const imageUrl = product.images?.[0]?.url ?? "/placeholder-product.jpg";
  return (
    <article className="group relative  transition-all hover:-translate-y-0.5 surface-card">
      {/* Image */}
      <Link
        href={`/product/${product._id}`}
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-50"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
        />

        {!product.images[0]?.url && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute px-3 py-1 text-xs font-semibold text-white rounded-full shadow left-4 top-4 bg-rose-600">
            -{discountPercentage}%
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={`/products/${product._id}`}>
          <h3 className="text-base font-semibold text-gray-900 transition-colors line-clamp-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        {/* Short Description */}
        {product.description && (
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
            {product?.description}
          </p>
        )}

        {/* Category */}
        <p className="text-xs text-gray-500">{product?.category?.name || ""}</p>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-gray-900">
            ${product?.price?.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product?.oldPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
