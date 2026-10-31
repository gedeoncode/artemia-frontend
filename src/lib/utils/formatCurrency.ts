/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - ISO currency code (default: 'USD')
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    console.warn("Invalid amount passed to formatCurrency:", amount);
    return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
