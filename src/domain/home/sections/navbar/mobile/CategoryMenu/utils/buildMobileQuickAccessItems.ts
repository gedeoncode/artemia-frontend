import { CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { QuickAccessItem } from "../MobileQuickAccessBar";
import { getCategoryUrl } from "@/domain/home/utils";


export function buildMobileQuickAccessItems(
  rootCategories: CategoryNode[],
): QuickAccessItem[] {
  return [
    ...rootCategories.slice(0, 5).map((cat) => ({
      type: "category" as const,
      label: cat.name,
      href: getCategoryUrl(cat),
    })),
    {
      type: "action" as const,
      label: "Sell",
      href: "/seller/auth/register",
    },
  ];
}
