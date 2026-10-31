import Link from "next/link";
import Image from "next/image";
import {
  FiMoreVertical,
  FiTrash2,
  FiCheckCircle,
  FiEdit2,
} from "react-icons/fi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import { ProductStatusBadge } from "../../../../../../ProductStatusBadge";
import { formatPrice } from "@/lib";
import { Product } from "../../types";

type MobileProductCardProps = {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export const MobileProductCard = ({
  product,
  isSelected,
  onSelect,
  onDelete,
  onEdit
}: MobileProductCardProps) => {
  return (
    <div
      className={`relative flex items-start justify-between rounded-lg border p-4 transition-all duration-200 ${
        isSelected
          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
          : "border-slate-200 bg-white"
      }`}
      onClick={() => product._id && onSelect(product._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          if (product._id) {
            onSelect(product._id);
          }
        }
      }}
    >
      <div className="flex flex-1 gap-3">
        {product.primaryImage && (
          <div className="flex-shrink-0">
            <Image
              src={product.primaryImage}
              alt={product.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-md object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col">
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>

            <p className="text-xs text-gray-500">
              SKU: {product._id?.slice(0, 8) ?? "N/A"}
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <span className="font-medium text-gray-900">
              {formatPrice(product.price)}
            </span>

            <span className="text-sm text-gray-600">
              Stock: {product.stock}
            </span>

            <span className="text-xs text-gray-500 capitalize">
              {product.inventoryStatus.replaceAll("_", " ")}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <ProductStatusBadge status={product.displayStatus} />

            {product.sales > 0 && (
              <span className="text-xs text-gray-500">
                {product.sales} sale
                {product.sales > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="absolute right-2 top-2">
          <FiCheckCircle className="h-5 w-5 text-purple-600" />
        </div>
      )}

      <div className="ml-2" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Open actions menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <FiMoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={()=> onEdit(product._id)}  className="flex items-center gap-2"  >
           
                <FiEdit2 className="h-4 w-4" />
                Edit
            </DropdownMenuItem>

            {product.displayStatus === "rejected" && (
              <DropdownMenuItem asChild>
                <Link href={`/seller/dashboard/products/${product._id}/edit`}>
                  Fix & Resubmit
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => product._id && onDelete(product._id)}
              className="text-red-600 focus:text-red-600"
            >
              <FiTrash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
