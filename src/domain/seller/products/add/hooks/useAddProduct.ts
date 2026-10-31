"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useMemo, useCallback } from "react";

import {
  LISTING_CAPABILITIES,
  productFormDefaults,
} from "@/domain/seller/products/add/constants";
import {
  CreateProductResponseFormSchema,
  type CreateProductFormSchema,
} from "@/domain/seller/products/schemas";

import { validateCategoryFields } from "../utils/validateCategoryField";

import { useImageUpload } from "./useImageUpload";
import { useStepper } from "./useStepper";
import { useListingFee } from "./useListingFee";
import { useFormPersistence } from "./useFormPersistence";
import { useCategories } from "./useCategories";
import { ROUTES } from "@/domain/seller/constants/routes";
import { useCreateProduct } from "./useCreateProduct";
import { BaseError } from "@/errors";
import { getUserFacingMessage } from "@/errors/userMessage";
import { createProductResolver } from "../../schemas/createProductResolver";
import { toMinorUnits } from "../utils";
import { clearAllProductPersistence } from "../utils/cleanupPersistence";

export const useAddProduct = () => {
  const createProductMutation = useCreateProduct();

  // ────────────────────────────────
  // 🌐 External Hooks
  // ────────────────────────────────
  const { categories, error: categoryError } = useCategories();
  const { currentStep, next, prev } = useStepper({ maxStep: 4 });


  // ────────────────────────────────
  // 📝 Form Setup (React Hook Form)
  // ────────────────────────────────
  const resolver = useMemo(
    () => createProductResolver(categories),

    [categories],
  );
  const methods = useForm<CreateProductFormSchema>({
    resolver,

    defaultValues: productFormDefaults,

    mode: "onBlur",
  });

  const {
    handleSubmit,
    reset,
    control,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const { append: addVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    imageData,
    handleImagesUpload,
    removeImage,
    handleSetPrimaryImage,
   
    uploadStatuses,
    uploadError,
    isUploading,
    maxImages,
    maxFileSize,
    acceptedFormats,
  } = useImageUpload();

  const { hydrated } = useFormPersistence(methods);

  // ────────────────────────────────
  // 🧹 Unified Cleanup Helper
  // ────────────────────────────────
  const cleanupAll = useCallback(() => {
    clearAllProductPersistence()
    reset(productFormDefaults);
  }, [ reset]);

  // ────────────────────────────────
  // 💰 Fee + Commission Logic
  // ────────────────────────────────
  const watchedCategory = watch("category");
  const categoryMap = useMemo(
    () => new Map(categories?.map((c) => [c._id, c])),

    [categories],
  );
  const selectedCategory = categoryMap.get(watchedCategory);

  const commissionModel =
    selectedCategory?.allowedModes?.find(
      (mode) => mode === "PAP" || mode === "PAL",
    ) ?? "PAL";
  const feeConfig = useMemo(
    () => ({
      rate:
        selectedCategory?.modeRules?.[commissionModel]?.commissionRate ?? 0.1,
      min: selectedCategory?.modeRules?.[commissionModel]?.minFee ?? 1,
      max: selectedCategory?.modeRules?.[commissionModel]?.maxFee ?? 100,
    }),
    [selectedCategory, commissionModel],
  );

  const {
    price,
    fee: listingFee,
    sellerEarns,
    formatted,
  } = useListingFee({
    control,
    fieldName: "pricing.currentPrice",
    config: feeConfig,
    mode: commissionModel,
  });

  // ────────────────────────────────
  // 🚀 Submit Logic
  // ────────────────────────────────

  const handleProductSubmit = async (
    data: CreateProductFormSchema,
  ): Promise<CreateProductResponseFormSchema> => {
    const capabilities =
      LISTING_CAPABILITIES[selectedCategory?.nature ?? "product"];
    const categoryErrorMsg = validateCategoryFields(
      String(data.category),
      data.details ?? {},
    );
    if (categoryErrorMsg) {
      setError("details", { message: categoryErrorMsg });
      return { success: false, message: categoryErrorMsg };
    }

    if (isUploading) {
      return { success: false, message: "Please wait for image uploads." };
    }

    if (!imageData.length) {
      return { success: false, message: "Please upload at least one image." };
    }
    if (!capabilities.inventory.enabled) {
      data.stock = 0;
      data.trackQuantity = false;
      data.continueSellingWhenOutOfStock = false;
    }
    if (!capabilities.location.enabled) {
      delete data.shipping;
    }

    try {
      const normalizedData = {
        ...data,

        pricing: {
          ...data.pricing,

          currentPriceMinor: toMinorUnits(data.pricing.currentPrice),

          minPriceMinor: toMinorUnits(data.pricing.minPrice),

          maxPriceMinor: toMinorUnits(data.pricing.maxPrice),
        },
      };

      await createProductMutation.mutateAsync({
        formData: normalizedData,
        images: imageData,
      });

      // if (commissionModel === "PAP") {
      //   const paymentSessionId = response?.paymentSessionId;
      //   if (paymentSessionId) {
      //     return {
      //       success: true,
      //       paymentSessionId,
      //       redirectPath: `/seller/payment?paymentId=${paymentSessionId}`,
      //       deferCleanup: true, // <-- mark deferred cleanup
      //     };
      //   }
      //   return { success: false, message: "Payment session failed to start." };
      // }

      // Normal flow
      return {
        success: true,
        redirectPath: ROUTES.PRODUCTS.LIST,
        deferCleanup: true,
      };
    } catch (err) {
      console.error("❌ Error creating product:", err);
      return {
        success: false,
        message:
          err instanceof BaseError
            ? getUserFacingMessage(err.message)
            : "Unexpected error while creating product.",
      };
    }
  };

  // ────────────────────────────────
  // 📦 Public API
  // ────────────────────────────────
  return {
    methods,
    submitForm: handleSubmit(handleProductSubmit),

    handleProductSubmit, // exported for manual use (for modal confirm flow)

    // images
    imageData,
    handleImagesUpload,
    removeImage,
    handleSetPrimaryImage,
    uploadStatuses,
    uploadError,
    maxImages,
    maxFileSize,
    acceptedFormats,

    // categories
    categories,
    currentStep,
    next,
    prev,

    // states
    loading: isUploading || createProductMutation.isPending,
    error:
      categoryError ||
      (createProductMutation.error instanceof BaseError
        ? getUserFacingMessage(createProductMutation.error.message)
        : null),
    errors,

    // variants
    addVariant,
    removeVariant,

    // fees
    price,
    listingFee,
    sellerEarns,
    commissionModel,
    feeConfig,
    formatted,

    selectedCategory,
    hydrated,
    cleanupAll,
  } as const;
};
