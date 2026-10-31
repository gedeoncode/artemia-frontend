import { useMemo } from "react";

export const useCurrencyFormatter = (
  currency: string = "USD",
  locale: string = "en-US"
) => {
  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      // Fallback: in case of invalid currency/locale
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
  }, [currency, locale]);

  const format = (amount: number): string => formatter.format(amount);

  const getSymbol = (): string => {
    try {
      // Extract currency symbol using formatToParts
      const parts = formatter.formatToParts(1);
      const symbol = parts.find((p) => p.type === "currency")?.value;
      return symbol ?? currency;
    } catch {
      return currency;
    }
  };

  return { format, getSymbol };
};
