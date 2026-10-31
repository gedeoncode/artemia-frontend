import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Product Item component
export function ProductItem({ product }: { product: any }) {
  return (
    <div className="flex items-center p-2 border rounded-lg hover:bg-gray-50">
      <div className="flex-shrink-0">
        {product.images.length > 0 ? (
          <Image
            src={
              typeof product.images[0] === "string"
                ? product.images[0]
                : product.images[0].url
            }
            alt={product.name}
            width={40}
            height={40}
            className="object-cover w-10 h-10 rounded"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded">
            <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 ml-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-500">
          Sold: {product.salesCount} | ${product.price}
        </p>
      </div>
      <Link
        href={`/admin/products/${product._id}`}
        className="text-sm text-blue-600 hover:underline"
      >
        View
      </Link>
    </div>
  );
}
