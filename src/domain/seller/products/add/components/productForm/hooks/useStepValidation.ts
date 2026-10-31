import { useCallback, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Category } from "@/types";
import { CreateProductFormSchema } from "../../../../schemas";
import { getStepFields } from "../utils/getStepFields";

interface UseStepValidationProps {
  currentStep: number;
  methods: UseFormReturn<CreateProductFormSchema>;
  selectedCategory: Category;
  registerStepValidity: (step: number, isValid: boolean) => void;
}

export function useStepValidation({
  currentStep,
  methods,
  selectedCategory,
  registerStepValidity,
}: UseStepValidationProps) {
  const validationTimeout = useRef<NodeJS.Timeout | null>(null);

  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fields = getStepFields({
        step,
        selectedCategory,
        resolveActiveFields: (attributes) => {
          const details = methods.getValues("details") ?? {};
          return attributes
            .filter((attr) => {
              // isAttributeVisible logic
              if (!attr.visibleWhen) return true;
              const fieldValue = details[attr.visibleWhen.field];
              return attr.visibleWhen.value === fieldValue;
            })
            .map((attr) => `details.${attr.key}`);
        },
      });

      const isValid = await methods.trigger(fields, {
        shouldFocus: false,
      });

      registerStepValidity(step, isValid);
      return isValid;
    },
    [methods, selectedCategory, registerStepValidity]
  );

  // Watch fields for validation
  const details = methods.watch("details") ?? {};
  const watchedName = methods.watch("name");
  const watchedCategory = methods.watch("category");
  const watchedDescription = methods.watch("description");
  const watchedPrice = methods.watch("pricing");

  // Get active fields for watching
  const activeFields = selectedCategory?.attributes
    ?.filter((attr) => {
      if (!attr.visibleWhen) return true;
      const fieldValue = details[attr.visibleWhen.field];
      return attr.visibleWhen.value === fieldValue;
    })
    .map((attr) => `details.${attr.key}`) ?? [];

  const watchedActiveFields = methods.watch(activeFields);

  // Debounced validation effect
  useEffect(() => {
    if (validationTimeout.current) {
      clearTimeout(validationTimeout.current);
    }

    validationTimeout.current = setTimeout(() => {
      validateStep(currentStep);
    }, 250);

    return () => {
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
    };
  }, [
    currentStep,
    watchedName,
    watchedCategory,
    watchedDescription,
    watchedActiveFields,
    watchedPrice,
    validateStep,
  ]);

  return { validateStep };
}