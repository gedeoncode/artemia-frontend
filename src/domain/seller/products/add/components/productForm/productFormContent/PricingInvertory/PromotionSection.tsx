"use client";

import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { AlertMessage } from "@/components/error/AlertMessage";

import { Percent } from "lucide-react";

import { cn } from "@/lib/utils/";
import type { CreateProductFormSchema } from "@/domain/seller/products/schemas";

interface PromotionSectionProps {
  isSubmitting: boolean;

  currencyUtils: {
    format: (value: number) => string;
    getSymbol: () => string;
  };

  lang?: "fr" | "en";
}

export const PromotionSection = ({
  isSubmitting,
  currencyUtils,
  lang: langProp = "fr",
}: PromotionSectionProps) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProductFormSchema>();

  const [lang, setLang] = useState<"fr" | "en">(langProp);

  const [isDeal, currentPrice, dealPrice] = useWatch({
    control,
    name: [
      "pricing.deal.isActive",
      "pricing.currentPrice",
      "pricing.deal.price",
    ],
  });

  useEffect(() => {
    if (!langProp && typeof window !== "undefined") {
      const userLang = navigator.language.toLowerCase();
      setLang(userLang.startsWith("fr") ? "fr" : "en");
    }
  }, [langProp]);

  const t = useMemo(
    () => ({
      fr: {
        labelToggle: "Activer une promotion",

        labelPrice: "Prix promotionnel",

        placeholder: currentPrice
          ? `Ex: ${(currentPrice * 0.9).toFixed(2)}`
          : "Prix promotionnel",

        mustBeLower: currentPrice
          ? `Doit être inférieur à ${currencyUtils.format(currentPrice)}`
          : "",

        hint:
          "💡 Une promotion claire attire plus de clics et augmente les ventes.",

        discountText: (percent: number) =>
          `Réduction de ${percent.toFixed(1)} %`,
      },

      en: {
        labelToggle: "Enable promotion",

        labelPrice: "Promotional Price",

        placeholder: currentPrice
          ? `e.g. ${(currentPrice * 0.9).toFixed(2)}`
          : "Promotional price",

        mustBeLower: currentPrice
          ? `Must be lower than ${currencyUtils.format(currentPrice)}`
          : "",

        hint:
          "💡 A clear promotion attracts more clicks and increases conversions.",

        discountText: (percent: number) =>
          `${percent.toFixed(1)}% discount`,
      },
    }),
    [ currentPrice, currencyUtils],
  );
  const text = t[lang]

  const dealPriceError =
    errors?.pricing?.deal?.price?.message;

  const discountPercent = useMemo(() => {
    if (
      !isDeal ||
      !currentPrice ||
      !dealPrice ||
      dealPrice >= currentPrice
    ) {
      return 0;
    }

    return ((currentPrice - dealPrice) / currentPrice) * 100;
  }, [isDeal, currentPrice, dealPrice]);

  return (
    <section
      className={cn(
        "rounded-xl border p-4 space-y-4 transition-all duration-200",
        isDeal
          ? "border-green-100 bg-green-50"
          : "border-gray-200 bg-gray-50",
      )}
    >
      {/* Toggle */}

      <div className="flex items-center justify-between">
        <Label
          htmlFor="pricing.deal.isActive"
          className="font-medium text-gray-900"
        >
          {text.labelToggle}
        </Label>

        <Switch
          id="pricing.deal.isActive"
          variant="primary"
          checked={!!isDeal}
          disabled={isSubmitting}
          onCheckedChange={(value) => {
            setValue("pricing.deal.isActive", value);

            if (!value) {
              setValue("pricing.deal.price", undefined);
            }
          }}
        />
      </div>

      {/* Deal Price */}

      {isDeal && (
        <motion.div
          key="deal-price"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <Label
              htmlFor="pricing.deal.price"
              className="font-medium text-gray-900"
            >
              {text.labelPrice}
            </Label>

            <span className="text-xs text-gray-500">
              {text.mustBeLower}
            </span>
          </div>

          <div className="relative">
            <Input
              id="pricing.deal.price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              disabled={isSubmitting}
              placeholder={text.placeholder}
              aria-invalid={!!dealPriceError}
              className={cn(
                "w-full py-2 pl-8 pr-4 text-lg font-medium",
                dealPriceError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-blue-200",
              )}
              {...register("pricing.deal.price", {
                valueAsNumber: true,
              })}
            />

            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500">
              {currencyUtils.getSymbol()}
            </span>
          </div>

          {dealPriceError ? (
            <AlertMessage
              variant="error"
              message={String(dealPriceError)}
            />
          ) : (
            <p className="text-sm text-gray-600">
              {text.hint}
            </p>
          )}

          {discountPercent > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-800"
            >
              <Percent className="w-4 h-4" />

              <span>
                {text.discountText(discountPercent)}
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  );
};