"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Input, Label } from "@/components/ui/";
import { AlertMessage } from "@/components/error/AlertMessage";

import { cn } from "@/lib/utils/";
import type { CreateProductFormSchema } from "@/domain/seller/products/schemas";

interface PriceFieldProps {
  currency: string;
  locale: string;
  minPrice: number;
  maxPrice: number;
  isEdit: boolean;
  isSubmitting: boolean;
  currencySymbol: string;
  lang?: "fr" | "en";
}

export const PriceField = ({
  currency,
  minPrice,
  maxPrice,
  isEdit,
  isSubmitting,
  currencySymbol,
  lang: langProp = "fr",
}: PriceFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductFormSchema>();

  const [lang, setLang] = useState<"fr" | "en">(langProp);

  useEffect(() => {
    if (!langProp && typeof window !== "undefined") {
      const userLang = navigator.language.toLowerCase();
      setLang(userLang.startsWith("fr") ? "fr" : "en");
    }
  }, [langProp]);

  const text = useMemo(() => {
    const t = {
      fr: {
        label: "Prix de vente *",
        placeholder: "Entrez le prix",
        hint: `Plage recommandée : ${minPrice.toFixed(
          2,
        )} - ${maxPrice.toFixed(2)} ${currency}`,
      },

      en: {
        label: "Selling Price *",
        placeholder: "Enter price",
        hint: `Recommended range: ${minPrice.toFixed(
          2,
        )} - ${maxPrice.toFixed(2)} ${currency}`,
      },
    };

    return t[lang];
  }, [lang, minPrice, maxPrice, currency]);

  const fieldError =
    errors?.pricing?.currentPrice?.message;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="pricing.currentPrice"
          className="font-medium text-gray-900"
        >
          {text.label}
        </Label>

        {isEdit && (
          <span className="text-xs italic text-gray-500">
            Editing enabled
          </span>
        )}
      </div>

      <div className="relative">
        <Input
          id="pricing.currentPrice"
          type="number"
          inputMode="decimal"
          step="0.01"
          min={minPrice}
          max={maxPrice}
          placeholder={text.placeholder}
          disabled={isSubmitting}
          aria-invalid={!!fieldError}
          className={cn(
            "w-full py-2 pl-10 pr-4 text-lg font-medium transition-colors duration-200",
            fieldError
              ? "border-red-400 focus:border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:border-primary focus:ring-primary/30",
          )}
          {...register("pricing.currentPrice", {
            valueAsNumber: true,
          })}
        />

        <span
          className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
          title={currency}
        >
          {currencySymbol}
        </span>
      </div>

      {fieldError ? (
        <AlertMessage
          variant="error"
          message={String(fieldError)}
        />
      ) : (
        <p className="text-sm text-slate-500">
          {text.hint}
        </p>
      )}
    </div>
  );
};