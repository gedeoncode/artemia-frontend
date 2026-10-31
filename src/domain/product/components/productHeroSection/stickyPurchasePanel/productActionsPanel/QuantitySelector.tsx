type QuantitySelectorProps = {
  quantity: number;
  maxQuantity: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function QuantitySelector({
  quantity,
  maxQuantity,
  disabled = false,
  onChange,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (!disabled && quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (!disabled && quantity < maxQuantity) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="quantity"
          className="text-sm font-medium text-foreground"
        >
          Quantity
        </label>

        {maxQuantity <= 10 && (
          <span className="text-xs text-muted-foreground">
            {maxQuantity} available
          </span>
        )}
      </div>

      <div
        className="inline-flex h-10 overflow-hidden rounded-sm border border-input bg-background"
        role="group"
        aria-label="Quantity selector"
      >
        <button
          type="button"
          onClick={decrease}
          disabled={disabled || quantity === 1}
          aria-label="Decrease quantity"
          className="flex h-full w-10 items-center justify-center border-r transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          −
        </button>

        <div
          id="quantity"
          className="flex min-w-14 items-center justify-center px-4 text-sm font-semibold"
          aria-live="polite"
        >
          {quantity}
        </div>

        <button
          type="button"
          onClick={increase}
          disabled={disabled || quantity === maxQuantity}
          aria-label="Increase quantity"
          className="flex h-full w-10 items-center justify-center border-l transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
}