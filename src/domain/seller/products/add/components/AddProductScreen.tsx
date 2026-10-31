"use client";

import { FormProvider } from "react-hook-form";
import { StepperProvider } from "../context";
import { useAddProduct } from "../hooks/useAddProduct";
import { ProductForm } from "./productForm/ProductForm";
import { steps } from "../constants/steps";

import { TooltipProvider } from "@/components/ui/Tooltip";
import { Category } from "@/types";

interface Props {
  preloadedCategories?: Category[];
}

export function AddProductScreen({ preloadedCategories }: Props) {
  const {
    methods,
    categories,
    imageData,
    handleImagesUpload,
    removeImage,
    handleSetPrimaryImage,
    uploadError,
    maxImages,
    maxFileSize,
    acceptedFormats,
    handleProductSubmit,
    loading,
    error,
    price,
    listingFee,
    sellerEarns,
    commissionModel,
    feeConfig,
    cleanupAll,
    selectedCategory,
  } = useAddProduct();

  // Gracefully fall back to preloaded categories if hook hasn’t fetched yet
  const resolvedCategories = categories ?? preloadedCategories ?? [];

  return (
    <StepperProvider totalSteps={steps.length}>
      <TooltipProvider>
        <FormProvider {...methods}>
          <ProductForm
            categories={resolvedCategories}
            imageData={imageData}
            handleImagesUpload={handleImagesUpload}
            removeImage={removeImage}
            handleSetPrimaryImage={handleSetPrimaryImage}
            uploadError={uploadError}
            loading={loading}
            maxImages={maxImages}
            maxFileSize={maxFileSize}
            acceptedFormats={acceptedFormats}
            handleProductSubmit={handleProductSubmit}
            methods={methods} // ✅ for form value access
            error={error}
            price={price}
            listingFee={listingFee}
            sellerEarns={sellerEarns}
            feeConfig={feeConfig}
            commissionModel={commissionModel}
            cleanupAll={cleanupAll}
            selectedCategory={selectedCategory}
          />
        </FormProvider>
      </TooltipProvider>
    </StepperProvider>
  );
}
