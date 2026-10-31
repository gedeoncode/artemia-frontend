interface PriceProps {
  price: number;
  discountedPrice?: number;
  currency?: string;
  shippingLabel?: string;
}

const formatPrice = (value: number, currency: string) =>
  `${currency}${value.toFixed(2)}`;

export function Price({
  price,
  discountedPrice,
  currency = "$",
  shippingLabel = "+ $5.99 shipping",
}: PriceProps) {
  const isDiscountValid =
    typeof discountedPrice === "number" && discountedPrice < price;

  const finalPrice = isDiscountValid ? discountedPrice : price;

  const discountPercent = isDiscountValid
    ? Math.round(((price - discountedPrice!) / price) * 100)
    : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        {
          price && (

        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(finalPrice, currency)}
        </span>
          )
        }

        {isDiscountValid && (
          <>
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(price, currency)}
            </span>

            <span className="text-sm font-medium text-green-600">
              {discountPercent}% off
            </span>
          </>
        )}
      </div>

      <p className="text-sm text-gray-500">{shippingLabel}</p>
    </div>
  );
}