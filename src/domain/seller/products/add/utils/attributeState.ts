import { CategoryAttribute } from "@/types";
import { CreateProductFormSchema } from "../../schemas";
import { UseFormReturn } from "react-hook-form";
import { evaluateCondition } from "./evaluateCondition";

export const getFieldName = (key: string) => `details.${key}`;

export function isAttributeVisible(
  attr: CategoryAttribute,

  values: Record<string, unknown>,
) {
  if (!attr.visibleWhen) {
    return true;
  }
  return evaluateCondition(
    attr.visibleWhen,

    values,
  );
}
export function getDetailsValues(
  methods: UseFormReturn<CreateProductFormSchema>,
) {
  return methods.getValues("details") ?? {};
}

export function isAttributeRequired(
  attr: CategoryAttribute,
  values: Record<string, unknown>,
) {
  if (attr.required) {
    return true;
  }
  return evaluateCondition(attr.requiredWhen, values);
}

export function isAttributeDisabled(
  attr: CategoryAttribute,

  values: Record<string, unknown>,
) {
  return evaluateCondition(
    attr.disabledWhen,

    values,
  );
}
