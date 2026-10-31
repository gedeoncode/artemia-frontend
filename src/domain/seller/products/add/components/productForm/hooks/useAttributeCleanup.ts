import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Category } from "@/types";
import { CreateProductFormSchema } from "../../../../schemas";

interface UseAttributeCleanupProps {
  selectedCategory: Category;
  methods: UseFormReturn<CreateProductFormSchema>;
}

export function useAttributeCleanup({
  selectedCategory,
  methods,
}: UseAttributeCleanupProps) {
  const { getValues, setValue } = methods;

  const dependencyMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    const attributes = selectedCategory?.attributes ?? [];

    for (const attr of attributes) {
      const deps = [
        attr.visibleWhen?.field,
        attr.requiredWhen?.field,
        attr.disabledWhen?.field,
      ].filter(Boolean) as string[];

      map[`details.${attr.key}`] = deps.map((dep) => `details.${dep}`);
    }

    return map;
  }, [selectedCategory]);

  useEffect(() => {
    const details = getValues("details") ?? {};

    for (const [field] of Object.entries(dependencyMap)) {
      const attribute = selectedCategory?.attributes?.find(
        (a) => `details.${a.key}` === field
      );

      if (!attribute) {
        continue;
      }

      // Check if attribute is still visible
      let stillVisible = true;
      if (attribute.visibleWhen) {
        const fieldValue = details[attribute.visibleWhen.field];
        stillVisible = attribute.visibleWhen.value === fieldValue;
      }

      if (!stillVisible) {
        setValue(
          field as any,
          undefined,
          {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: false,
          }
        );
      }
    }
  }, [dependencyMap, getValues, setValue, selectedCategory]);
}