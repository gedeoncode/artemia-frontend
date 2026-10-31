import { useEffect, useState } from "react";
import type { Control } from "react-hook-form";

interface StepValidationProps<T> {
  control: Control<T>;
  stepIndex: number;
  registerStepValidity: (step: number, isValid: boolean) => void;
  dependencies: unknown[];
}

export const useStepValidation = <T>({
  control,
  stepIndex,
  registerStepValidity,
  dependencies,
}: StepValidationProps<T>) => {
  const [localValidity, setLocalValidity] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simulate lightweight validation logic
    // You can integrate `trigger()` or schema validation here if needed.
    const isPriceValid = Boolean((control._formValues as any)?.price > 0);
    const isDealPriceValid = Boolean(
      (control._formValues as any)?.dealPrice
        ? (control._formValues as any)?.dealPrice < (control._formValues as any)?.price
        : true
    );
    const isStockValid = (control._formValues as any)?.trackQuantity
      ? (control._formValues as any)?.stock > 0
      : true;

    const stepValid = isPriceValid && isDealPriceValid && isStockValid;

    const newValidity = {
      price: isPriceValid,
      dealPrice: isDealPriceValid,
      stock: isStockValid,
    };

    setLocalValidity(newValidity);
    registerStepValidity(stepIndex, stepValid);
  }, [control, stepIndex, registerStepValidity, ...dependencies]);

  return { localValidity };
};
