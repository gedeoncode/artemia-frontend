import { memo } from "react";
import Image from "next/image";

export const ProductItem = memo(
  function ProductItem({ item, currency }) {
    const { product } = item;

    return (
      <div className="flex gap-4 p-3 transition-colors border rounded-lg hover:bg-gray-50">
        {/* Image with priority loading for above-the-fold items */}
        <div className="relative flex-shrink-0 overflow-hidden rounded-md h-18 w-18">
          <Image
            src={product.images[0].url || "/placeholder-product.jpg"}
            alt={product.name}
            width={64}
            height={64}
            className="object-cover"
            sizes="64px"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Product details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{product.name}</h3>
          <div className="space-x-2 text-sm text-muted-foreground">
            <span>SKU: {item.sku}</span>
            <span>|</span>
            <span>Seller: {product.seller?.name || "N/A"}</span>
          </div>

          {/* Variations - only render if they exist */}
          {item.variation && Object.keys(item.variation).length > 0 && (
            <div className="flex flex-wrap mt-1 text-xs gap-x-2 gap-y-1 text-muted-foreground">
              {Object.entries(item.variation).map(([key, value]) => (
                <span key={`${item.sku}-${key}`}>
                  {key}: <span className="font-medium">{value}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing information */}
        <div className="flex-shrink-0 space-y-1 text-sm text-right">
          <div>Qty: {item.quantity}</div>
          <div>
            Unit: {currency} {item.unitPrice?.toFixed(2) || "0.00"}
          </div>
          <div className="font-semibold">
            Subtotal: {currency} {item.subtotal?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>
    );
  },
  // Custom comparison function for memo
  (prevProps, nextProps) => {
    return (
      prevProps.item._id === nextProps.item._id &&
      prevProps.currency === nextProps.currency
    );
  }
);
