"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

import {
  PriceField,
  PromotionSection,
  InventorySection,
  // CommissionBreakdown,
  useCurrencyFormatter,
} from ".";
import { SectionHeader } from "../../../ui/SectionHeader";
import { cn } from "@/lib/utils/";
import { CommissionModel } from "@/types/seller";
import { CreateProductFormSchema } from "@/domain/seller/products/schemas";

interface PricingInventorySectionProps {
  isEdit?: boolean;
  currency?: string;
  locale?: string;
  stepIndex: number;
  registerStepValidity: (step: number, isValid: boolean) => void;
  isLoading?: boolean;
  sellerEarns?: number;
  listingFee?: number;
  minPrice: number;
  maxPrice: number;
  commissionRate: number;
  commissionModel: CommissionModel;
  className?: string;
  onPriceChange?: (price: number) => void;
}

export const PricingInventorySection = ({
  isEdit = false,
  currency = "USD",
  locale = "en-US",
  stepIndex,
  registerStepValidity,
  minPrice,
  maxPrice,
  // commissionRate,
  // commissionModel,
  // sellerEarns,
  // listingFee,
  className,
  onPriceChange,
}: PricingInventorySectionProps) => {
  const { control, trigger } = useFormContext<CreateProductFormSchema>();

  // Watch form values
  const [dealActive, trackQuantity, currentPrice] = useWatch({
    control,
    name: ["pricing.deal.isActive", "trackQuantity", "pricing.currentPrice"],
  });

  // Currency formatter
  const currencyUtils = useCurrencyFormatter(currency, locale);

  // Step validity
  const [localValidity, setLocalValidity] = useState({
    price: false,
    dealPrice: false,
    stock: false,
  });

  useEffect(() => {
    const validateStep = async () => {
      const priceValid = await trigger("pricing.currentPrice");

      const dealValid = dealActive ? await trigger("pricing.deal") : true;

      const stockValid = trackQuantity ? await trigger("stock") : true;

      setLocalValidity({
        price: priceValid,
        dealPrice: dealValid,
        stock: stockValid,
      });

      registerStepValidity(stepIndex, priceValid && dealValid && stockValid);
    };

    validateStep();
  }, [
    currentPrice,
    dealActive,
    trackQuantity,
    stepIndex,
    trigger,
    registerStepValidity,
  ]);

  useEffect(() => {
    if (currentPrice && onPriceChange) onPriceChange(currentPrice);
  }, [currentPrice, onPriceChange]);

  return (
    <section className={cn("mb-4", className)}>
      {/* Header + Step validation */}
      <SectionHeader
        title="Tarification & Inventaire"
        description="Définissez votre stratégie de prix et de gestion des stocks."
      />

      {/* Main sections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Pricing */}
        <div className="space-y-6">
          <PriceField
            currency={currency}
            locale={locale}
            minPrice={minPrice}
            maxPrice={maxPrice}
            isEdit={isEdit}
            isSubmitting={false} // optionally get from RHF
            currencySymbol={currencyUtils.getSymbol()}
          />

          {/* {currentPrice > 0 && (
            <div>
              <CommissionBreakdown
                price={currentPrice}
                commissionRate={commissionRate}
                commissionModel={commissionModel!}
                sellerEarns={sellerEarns}
                listingFee={listingFee}
                currencyUtils={currencyUtils}
              />
            </div>
          )} */}
        </div>

        {/* Right: Promotion & Inventory */}
        <div className="space-y-6">
          <PromotionSection
            // isEdit={isEdit}
            isSubmitting={false}
            // currentPrice={currentPrice || 0}
            currencyUtils={currencyUtils}
          />

          <InventorySection
            isEdit={isEdit}
            isSubmitting={false}
            // trackQuantity={trackQuantity || false}
          />
        </div>
      </div>
    </section>
  );
};
