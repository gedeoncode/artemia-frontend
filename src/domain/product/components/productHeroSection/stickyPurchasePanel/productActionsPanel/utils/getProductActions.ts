import { ACTION_REGISTRY } from "./actionRegistry";
import { ProductActionContext, ProductActionDefinition } from "../types";
import { PRODUCT_ACTION_RULES } from "./actionRules";

export function getProductActions(
  context: ProductActionContext,
): ProductActionDefinition[] {
  const { categoryNature, isPurchasable } = context;

  const rules = PRODUCT_ACTION_RULES[categoryNature];

  if (!rules) {
    return [];
  }

  const actionIds =
    isPurchasable && rules.purchasable
      ? rules.purchasable
      : (rules.default ?? []);

  return actionIds.map((id: string) => ACTION_REGISTRY[id]);
}
