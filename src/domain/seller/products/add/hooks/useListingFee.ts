"use client";

import { CommissionModel } from "@/types";
import { useMemo } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

/** Supported listing fee modes */
export type FeeMode = CommissionModel;

/** Configuration for category-based fees */
export interface FeeConfig {
  /** Percentage rate (e.g., 10 for 10%) */
  rate: number;
  /** Minimum possible fee (applies to both PAP and PAL) */
  min: number;
  /** Maximum possible fee (applies to both PAP and PAL) */
  max: number;
}

/** Currency formatting options */
export interface CurrencyOptions {
  /** ISO 4217 code, e.g., "USD", "KES", "EUR" */
  currency: string;
  /** BCP 47 locale tag, e.g., "en-US", "sw-KE" */
  locale?: string;
  /** Optional number of fraction digits */
  precision?: number;
}

/** Hook input props */
export interface UseListingFeeProps<T extends FieldValues> {
  control: Control<T>;
  fieldName: Path<T>;
  config: FeeConfig;
  mode: FeeMode;
  currency?: CurrencyOptions;
}

/** Hook output */
export interface ListingFeeResult {
  price: number;
  fee: number;
  sellerEarns: number;
  payableImmediately: boolean;
  formatted: {
    price: string;
    fee: string;
    sellerEarns: string;
  };
}

/**
 * Computes category-based listing or commission fees.
 * - Enforces min/max fee bounds for both PAP and PAL modes.
 * - Automatically detects locale and currency if not provided.
 * - Returns both numeric and formatted values for UI display.
 */
export function useListingFee<T extends FieldValues>({
  control,
  fieldName,
  config,
  mode,
  currency,
}: UseListingFeeProps<T>): ListingFeeResult {
  const price = useWatch({ control, name: fieldName }) ?? 0;

  const result = useMemo<ListingFeeResult>(() => {
    const numericPrice = Number(price) || 0;
    const percentRate = Math.max(0, config.rate) / 100;
    const min = config.min ?? 1;
    const max = config.max ?? Number.POSITIVE_INFINITY;

    let fee = 0;
    let sellerEarns = 0;
    const payableImmediately = mode === "PAP";

    if (numericPrice > 0 && percentRate > 0) {
      const rawFee = numericPrice * percentRate;
      const boundedFee = Math.min(Math.max(rawFee, min), max);
      fee = Number(boundedFee.toFixed(2));
      sellerEarns = Number((numericPrice - fee).toFixed(2));
    }

    // --- Auto-detect locale & currency ---
    const detectedLocale =
      currency?.locale ??
      (typeof navigator !== "undefined" ? navigator.language : "en-US");

    const detectedCurrency =
      currency?.currency ??
      (() => {
        try {
          // Attempt to infer from locale using Intl (fallback-safe)
          const parts = new Intl.NumberFormat(detectedLocale, {
            style: "currency",
            currency: "USD",
          }).resolvedOptions();

          // You could replace this with a custom mapping if needed
          return parts.currency || "USD";
        } catch {
          return "USD";
        }
      })();

    const precision = currency?.precision ?? 2;

    const formatter = new Intl.NumberFormat(detectedLocale, {
      style: "currency",
      currency: detectedCurrency,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    return {
      price: numericPrice,
      fee,
      sellerEarns,
      payableImmediately,
      formatted: {
        price: formatter.format(numericPrice),
        fee: formatter.format(fee),
        sellerEarns: formatter.format(sellerEarns),
      },
    };
  }, [price, config.rate, config.min, config.max, mode, currency]);

  return result;
}
