// dynamic-form/utils/evaluateCondition.ts

import { CategoryAttribute, FieldCondition } from "@/types/category/CategoryAttribute.types";
export interface AttributeState {
  visible: boolean;
  required: boolean;
  disabled: boolean;
}


export function evaluateCondition(
  condition: FieldCondition | undefined,
  values: Record<string, unknown>,
): boolean {

  if (!condition) {
    return false;
  }

  return (
    values[condition.field] ===
    condition.value
  );
}

