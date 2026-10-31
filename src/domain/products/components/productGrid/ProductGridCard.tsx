"use client";
import { Product } from "@/types/product/product.types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function ProductGridCard({
  product,
  variant,
}: {
  product: Product;
  variant: "mobile" | "desktop";
}) {
  const [imgSrc, setImgSrc] = useState(
    product.images?.[0]?.url || "/placeholder.jpg",
  );

  return (
    <li>
      <Link
        href={`/product/${product._id}`}
        aria-label={`View details for ${product.name}`}
        className="relative block overflow-hidden transition rounded-sm group focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {/* Image */}
        <div className="relative w-full bg-slate-50 aspect-square">
          <Image
            src={imgSrc}
            alt={product.name || "Product image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={
              variant === "mobile"
                ? "(max-width: 640px) 50vw"
                : "(min-width: 640px) 200px"
            }
            onError={() => setImgSrc("/placeholder.jpg")}
            loading="lazy"
            quality={variant === "mobile" ? 80 : 90}
          />
        </div>

        {/* Name & Price */}
        {variant === "mobile" ? (
          <div className="p-2 space-y-1 text-center">
            <p className="text-sm font-medium text-gray-800 line-clamp-2">
              {product.name}
            </p>
            {product.price != null && (
              <p className="text-sm font-semibold text-gradient">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
        ) : (
          // Desktop hover overlay
          <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-white transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 to-transparent group-hover:opacity-100">
            <p className="font-medium line-clamp-1">{product.name}</p>
            {product.price != null && (
              <p className="font-semibold ">${product.price.toFixed(2)}</p>
            )}
          </div>
        )}
      </Link>
    </li>
  );
}
