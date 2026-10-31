"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Icons } from "@/components/Icons";
import { Category } from "../../../../../../domain/admin/categories/services/types";
import { formatDate } from "@/lib/utils/";
// Lazy-loaded dialogs with SSR disabled (load only on client)
const DeleteSubcategoryDialog = dynamic(
  () =>
    import("./dialogs/DeleteSubcategoryDialog").then(
      (mod) => mod.DeleteSubcategoryDialog,
    ),
  {
    ssr: false,
    loading: () => (
      <Button variant="ghost" size="sm" className="w-8 h-8" disabled />
    ),
  },
);

const EditSubcategoryDialog = dynamic(
  () =>
    import("./dialogs/EditSubcategoryDialog").then(
      (mod) => mod.EditSubcategoryDialog,
    ),
  {
    ssr: false,
    loading: () => (
      <Button variant="ghost" size="icon" className="w-8 h-8" disabled />
    ),
  },
);

// Preload dialog components (triggers fetch on hover)
const preloadDialogs = () => {
  Promise.all([
    import("./dialogs/DeleteSubcategoryDialog"),
    import("./dialogs/EditSubcategoryDialog"),
  ]).catch(console.error);
};

export const SubcategoryCard = React.memo(function SubcategoryCard({
  subcategory,
  parentCategory,
}: {
  subcategory: Category;
  parentCategory: Category;
}) {
  const [isImageLoading, setIsImageLoading] = useState(!!subcategory.image);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Memoized values
  const hasImage = useMemo(
    () => subcategory.image && !imageError,
    [subcategory.image, imageError],
  );

  const siblingNames = useMemo(
    () =>
      parentCategory.subcategories
        ?.filter((sc) => sc._id !== subcategory._id)
        .map((sc) => sc.name) || [],
    [parentCategory.subcategories, subcategory._id],
  );

  const statusVariant = useMemo(() => {
    switch (subcategory.status) {
      case "active":
        return "success";
      case "archived":
        return "secondary";
      case "inactive":
        return "destructive";
      default:
        return "outline";
    }
  }, [subcategory.status]);

  // Preload dialogs when card is hovered
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    preloadDialogs();
  }, []);

  const handleImageError = useCallback(() => {
    setIsImageLoading(false);
    setImageError(true);
  }, []);

  return (
    <div
      className="relative p-4 transition-all border rounded-lg hover:shadow-sm group bg-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/admin/manage-categories/${subcategory._id}`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Manage ${subcategory.name}`}
        prefetch={false}
      />

      {/* Optimized Image Loading */}
      {hasImage && (
        <div className="relative mb-3 overflow-hidden rounded-md aspect-video bg-muted">
          {isImageLoading && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}

          <Image
            src={subcategory.image}
            alt={subcategory.name}
            width={400}
            height={225}
            priority={false} // Let browser prioritize loading
            loading="lazy"
            quality={80} // Reduced quality for better performance
            onLoad={() => setIsImageLoading(false)}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
          />

          {!isImageLoading && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={subcategory.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View full image"
                >
                  <Icons.linkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">View full image</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex items-start justify-between">
        <div className="pr-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium line-clamp-1">{subcategory.name}</h3>
            <div className="flex items-center gap-1">
              <Badge variant={statusVariant} className="h-5 text-xs capitalize">
                {subcategory.status}
              </Badge>
              {subcategory.isFeatured && (
                <Badge variant="default" className="h-5 text-xs">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              {subcategory.productCount || 0} product
              {subcategory.productCount !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span className="capitalize">{subcategory.type}</span>
            {subcategory.requiresPayment && (
              <>
                <span>•</span>
                <Badge variant="outline" className="h-5 px-1.5 text-xs">
                  Paid
                </Badge>
              </>
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Updated: {formatDate(subcategory.updatedAt)}
          </p>
        </div>

        <Icons.chevronRight className="w-4 h-4 mt-1.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      {/* Actions (conditionally preloaded) */}
      <div className="absolute z-20 flex gap-1 top-3 right-3">
        <EditSubcategoryDialog
          subcategory={subcategory}
          currentNames={siblingNames}
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 opacity-0 group-hover:opacity-100 hover:bg-background focus-visible:opacity-100"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Edit ${subcategory.name}`}
          >
            <Icons.edit className="w-3.5 h-3.5" />
          </Button>
        </EditSubcategoryDialog>
        <DeleteSubcategoryDialog
          subcategoryId={subcategory._id}
          subcategoryName={subcategory.name}
          productCount={subcategory.productCount}
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 opacity-0 group-hover:opacity-100 hover:bg-background focus-visible:opacity-100"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Delete ${subcategory.name}`}
          >
            <Icons.delete className="w-3.5 h-3.5 " />
          </Button>
        </DeleteSubcategoryDialog>
      </div>
    </div>
  );
});
