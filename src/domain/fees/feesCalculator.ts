// /domain/fees/feeCalculator.ts
export function calculateListingFee({
  price,
  mode,
  config,
}: {
  price: number;
  mode: "PAP" | "PAL";
  config: FeeConfig;
}) {
  if (!price || price <= 0) return { fee: 0, sellerEarns: 0 };

  if (mode === "PAP") {
    const raw = price * config.rate;
    const bounded = Math.min(Math.max(raw, config.min), config.max);
    return { fee: bounded, sellerEarns: price };
  }

  if (mode === "PAL") {
    const commission = price * config.rate;
    return {
      fee: commission,
      sellerEarns: price - commission,
    };
  }

  return { fee: 0, sellerEarns: 0 };
}
