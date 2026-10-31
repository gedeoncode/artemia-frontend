// hooks/usePreview.ts

"use client";

import { useMemo } from "react";

import {
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";

import { Category } from "@/types/category/category.types";
import { Images } from "@/types";

import { CreateProductFormSchema } from "@/domain/seller/products/schemas";

import { LISTING_CAPABILITIES } from "../constants";
import {
  getFieldName,
  isAttributeVisible,
} from "../utils";

interface Props {
  categories: Category[];
  images: Images;
}

function flattenErrors(
  errors: unknown,
): string[] {
  if (!errors) {
    return [];
  }

  if (
    typeof errors === "object" &&
    errors !== null &&
    "message" in errors
  ) {
    return [
      String(
        (errors as { message: unknown })
          .message,
      ),
    ];
  }

  if (
    typeof errors === "object" &&
    errors !== null
  ) {
    return Object.values(errors).flatMap(
      flattenErrors,
    );
  }

  return [];
}

export function usePreview({
  categories,
  images,
}: Props) {
  const { control } =
    useFormContext<CreateProductFormSchema>();

  const { errors } = useFormState({
    control,
  });

  const [
    name,
    description,
    categoryId,
    details,
    pricing,
    shipping,
    stock,
    trackQuantity,
    continueSellingWhenOutOfStock,
  ] = useWatch({
    control,

    name: [
      "name",
      "description",
      "category",
      "details",
      "pricing",
      "shipping",
      "stock",
      "trackQuantity",
      "continueSellingWhenOutOfStock",
    ],
  });

  const selectedCategory =
    useMemo(
      () =>
        categories.find(
          (cat) =>
            cat._id === categoryId,
        ),
      [categories, categoryId],
    );

  const capabilities =
    useMemo(() => {
      const nature =
        selectedCategory?.nature ??
        "product";

      return (
        LISTING_CAPABILITIES[
          nature
        ]
      );
    }, [selectedCategory]);

  const mainImage = useMemo(
    () =>
      images.find(
        (img) => img.isPrimary,
      ) ??
      images[0] ??
      null,
    [images],
  );

  const visibleAttributes =
    useMemo(() => {
      if (!selectedCategory) {
        return [];
      }

      return (
        selectedCategory.attributes?.filter(
          (attr) =>
            isAttributeVisible(
              attr,
              details ?? {},
            ),
        ) ?? []
      );
    }, [
      selectedCategory,
      details,
    ]);

  const detailEntries =
    useMemo(() => {
      if (
        !selectedCategory ||
        !details
      ) {
        return [];
      }

      return visibleAttributes
        .filter((attr) => {
          const value =
            details[attr.key];

          return (
            value !== undefined &&
            value !== null &&
            value !== ""
          );
        })
        .map((attr) => ({
          key: attr.key,
          fieldName:
            getFieldName(
              attr.key,
            ),
          label: attr.label,
          type: attr.type,
          inputType:
            attr.inputType,
          value:
            details[attr.key],
        }));
    }, [
      visibleAttributes,
      selectedCategory,
      details,
    ]);

  const pricingSummary =
    useMemo(() => {
      if (!pricing) {
        return null;
      }

      switch (
        pricing.type
      ) {
        case "fixed":
        case "negotiable":
          return {
            type:
              pricing.type,
            label:
              `${pricing.currentPrice ?? 0} ${pricing.currencyCode}`,
            unit:
              pricing.unit,
          };

        case "range":
          return {
            type:
              pricing.type,
            label:
              `${pricing.minPrice ?? 0} - ${pricing.maxPrice ?? 0} ${pricing.currencyCode}`,
            unit:
              pricing.unit,
          };

        case "free":
          return {
            type: "free",
            label:
              "Gratuit",
            unit:
              pricing.unit,
          };

        default:
          return null;
      }
    }, [pricing]);

  const shippingSummary =
    useMemo(() => {
      if (
        !capabilities.shipping
          .enabled ||
        !shipping
      ) {
        return null;
      }

      return {
        handoverMethod:
          shipping.handoverMethod,

        weight:
          shipping.weight,

        city:
          shipping.location
            ?.city,

        quartier:
          shipping.location
            ?.quartier,

        avenue:
          shipping.location
            ?.avenue,
      };
    }, [
      shipping,
      capabilities,
    ]);

  const warnings = useMemo(() => {
    const items: string[] =
      [];

    if (errors.name) {
      items.push(
        String(
          errors.name.message,
        ),
      );
    }

    if (errors.category) {
      items.push(
        String(
          errors.category
            .message,
        ),
      );
    }

    if (
      errors.description
    ) {
      items.push(
        String(
          errors
            .description
            .message,
        ),
      );
    }

    if (
      errors.pricing
    ) {
      items.push(
        ...flattenErrors(
          errors.pricing,
        ),
      );
    }

    if (
      capabilities.shipping
        .enabled &&
      errors.shipping
    ) {
      items.push(
        ...flattenErrors(
          errors.shipping,
        ),
      );
    }

    if (
      errors.details
    ) {
      items.push(
        ...flattenErrors(
          errors.details,
        ),
      );
    }

    if (
      capabilities
        .inventory.enabled &&
      errors.stock
    ) {
      items.push(
        String(
          errors.stock
            .message,
        ),
      );
    }

    if (
      images.length === 0
    ) {
      items.push(
        "Ajoutez au moins une image.",
      );
    }

    return [
      ...new Set(items),
    ];
  }, [
    errors,
    images,
    capabilities,
  ]);

  const hasWarnings =
    warnings.length > 0;

  const isComplete =
    !hasWarnings &&
    Boolean(
      name?.trim(),
    ) &&
    Boolean(
      categoryId,
    ) &&
    Boolean(
      description?.trim(),
    ) &&
    images.length > 0;

  return {
    // Category

    selectedCategory,
    capabilities,

    // Basic info

    name: name ?? "",
    description:
      description ?? "",

    // Images

    images,
    mainImage,

    // Dynamic attributes

    details:
      details ?? {},
    visibleAttributes,
    detailEntries,

    // Pricing

    pricing,
    pricingSummary,

    // Shipping

    shipping:
      capabilities.shipping
        .enabled
        ? shipping
        : null,

    shippingSummary,

    // Inventory

    stock:
      capabilities
        .inventory.enabled
        ? stock ?? 0
        : null,

    trackQuantity:
      capabilities
        .inventory.enabled
        ? trackQuantity ??
          true
        : null,

    continueSellingWhenOutOfStock:
      capabilities
        .inventory.enabled
        ? continueSellingWhenOutOfStock ??
          false
        : null,

    // Validation

    warnings,
    hasWarnings,
    isComplete,
  };
}