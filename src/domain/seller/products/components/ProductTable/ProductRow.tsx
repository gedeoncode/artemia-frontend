"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { FiMoreVertical } from "react-icons/fi";
import { Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Checkbox } from "@/components/ui/Checkbox";

import { ProductStatusBadge } from "../../../../../../ProductStatusBadge";

import { formatPrice } from "@/lib";

import type { Product } from "@/domain/seller/products/types/product.types";

interface ProductRowProps {
  product: Product;

  isSelected: boolean;

  onSelect: (id: string) => void;

  onEdit: (id: string) => void;

  onDelete: (id: string) => void;

  isDeleting: boolean;
}

export function ProductRow({
  product,
  isSelected,

  onSelect,
  onEdit,
  onDelete,

  isDeleting,

}: ProductRowProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = (id: string) => {
    setOpen(false);
    onDelete(id);
  };

  return (
      <tr
        className={`border-b transition-colors ${
          isSelected ? "bg-purple-50" : "hover:bg-gray-50"
        } ${isDeleting ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <td className="whitespace-nowrap px-6 py-4">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(product._id)}
            disabled={isDeleting}
          />
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <div className="flex items-center">
            {product.primaryImage && (
              <div className="h-10 w-10 flex-shrink-0">
                <Image
                  src={product.primaryImage}
                  alt={`${product.name} thumbnail`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-md object-cover"
                />
              </div>
            )}

            <div className="ml-4">
              <div className="font-medium text-gray-900">
                {product.name}
              </div>

              <div className="text-sm text-gray-500">
                SKU: {product._id?.slice(0, 8) ?? "N/A"}
              </div>
            </div>
          </div>
        </td>

        <td className="whitespace-nowrap px-6 py-4 text-gray-900">
          {formatPrice(product.price)}
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium">{product.stock}</span>

            <span className="text-xs text-gray-500">
              {product.inventoryStatus?.replaceAll("_", " ")}
            </span>
          </div>
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          {product.sales ?? 0}
        </td>

        <td className="whitespace-nowrap px-6 py-4 text-gray-900">
          {typeof product.category === "object" &&
          product.category?.name
            ? product.category.name
            : "N/A"}
        </td>

        <td className="whitespace-nowrap px-6 py-4">
          <ProductStatusBadge
            status={product.publicationStatus}
          />
        </td>

        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
          {isDeleting ? (
            <div className="flex items-center justify-end text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Deleting...</span>
            </div>
          ) : (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onEdit(product._id)}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 focus:text-red-600"
                >
                  Delete
                </DropdownMenuItem>

                {product.displayStatus === "rejected" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/seller/dashboard/products/${product._id}/edit`}
                    >
                      Fix &amp; Resubmit
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </td>
      </tr>
  
  );
}