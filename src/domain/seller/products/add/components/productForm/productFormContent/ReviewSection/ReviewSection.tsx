"use client";

import { useState, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button/Button";

import { cn } from "@/lib/utils";

import { useCurrencyFormatter } from "../PricingInvertory";

import type {
  Category,
  CommissionModel,
} from "@/types/category/category.types";

import { ProductImages, ProductDetails, CustomerPreview } from ".";

import { Images } from "@/types";

import { usePreview } from "../../../../hooks/usePreview";
import { FormWarning } from "./FormWarning";
import { FormSectionCard } from "../ui/FormSectionCard";

interface ReviewSectionProps {
  categories: Category[];

  commissionModel: CommissionModel;

  commissionRate: number;

  listingFee: number;

  sellerEarns: number;

  images: Images;

  className?: string;
}

export function ReviewSection({
  categories,

  commissionModel,

  commissionRate,

  listingFee,

  sellerEarns,

  images = [],

  className,
}: ReviewSectionProps) {
  const {
    name,
    description,

    stock,
    pricing,
    shipping,

    trackQuantity,

    selectedCategory,
    capabilities,

    detailEntries,

    mainImage,

    warnings,
    hasWarnings,
  } = usePreview({
    categories,
    images,
  });

  // console.log("Has warnings", warnings)
  const [showCustomerView, setShowCustomerView] = useState(false);

  const [showFullDesc, setShowFullDesc] = useState(false);

  const currencyUtils = useCurrencyFormatter();

  const toggleCustomerView = useCallback(() => {
    setShowCustomerView((prev) => !prev);
  }, []);

  const toggleDescription = useCallback(() => {
    setShowFullDesc((prev) => !prev);
  }, []);

  return (
    <section className={cn("mb-4", className)}>
      <FormSectionCard
        title="Preview Your Listing"
        description="Review all details or see how your product will appear to customers."
        actions={
          <Button
            variant="outline"
            type="button"
            size="sm"
            data-ignore-submit="true"
            onClick={toggleCustomerView}
            aria-pressed={showCustomerView}
            className="flex items-center gap-2"
            leftIcon={
              showCustomerView ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )
            }
          >
            {showCustomerView ? (
              <>Exit Customer Preview</>
            ) : (
              <>View as Customer</>
            )}
          </Button>
        }
      >
        <AnimatePresence mode="wait">
          {!showCustomerView ? (
            <motion.div
              key="seller-view"
              initial={{
                opacity: 0,

                y: 20,
              }}
              animate={{
                opacity: 1,

                y: 0,
              }}
              exit={{
                opacity: 0,

                y: -20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="space-y-6"
            >
              {/* {hasWarnings && <FormWarning warnings={warnings}/>} */}

              <div className="grid gap-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6">
                <ProductImages images={images} name={name} />

                <ProductDetails
                  name={name}
                  description={description}
                  detailEntries={detailEntries}
                  capabilities={capabilities}
                  stock={stock}
                  trackQuantity={trackQuantity}
                  pricing={pricing}
                  shipping={shipping}
                  showFullDesc={showFullDesc}
                  toggleDescription={toggleDescription}
                  commissionModel={commissionModel}
                  commissionRate={commissionRate}
                  listingFee={listingFee}
                  sellerEarns={sellerEarns}
                  currencyUtils={currencyUtils}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="customer-view"
              initial={{
                opacity: 0,

                y: 20,
              }}
              animate={{
                opacity: 1,

                y: 0,
              }}
              exit={{
                opacity: 0,

                y: -20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
            >
              <CustomerPreview
                name={name}
                description={description}
                pricing={pricing}
                stock={stock}
                shipping={shipping}
                category={selectedCategory}
                detailEntries={detailEntries}
                mainImage={mainImage}
                images={images}
                currencyUtils={currencyUtils}
                capabilities={capabilities}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </FormSectionCard>
    </section>
  );
}
