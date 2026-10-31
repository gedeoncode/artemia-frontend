import {
  ProductActionDefinition,
  ProductActionId,
  ResolvedProductAction,
} from "../types";

export function resolveProductActions(
  actions: ProductActionDefinition[],
  handlers: Record<ProductActionId, () => Promise<void> | void>
): ResolvedProductAction[] {
  return actions.map((action) => ({
    ...action,
    handler: handlers[action.id],
  }));
}