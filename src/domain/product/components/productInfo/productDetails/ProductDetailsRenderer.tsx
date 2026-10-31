// /ui/ProductDetailsRenderer.tsx

import { ProductDetails } from "@/types/product";
import { productDetailsRegistry } from "./productDetailsRegistry";
import { GenericDetailsView } from "./views/GenericDetailsView";
type Props = {
  details: ProductDetails;
};
export function ProductDetailsRenderer({ details }: Props) {
  // 🔒 guard
  if (!details || typeof details !== "object") {
    return <GenericDetailsView details={{}} />;
  }

  const type = details.categoryType || "unknown";

  const Component = productDetailsRegistry[type];

  if (Component) {
    return <Component details={details} />;
  }

  // 🔥 Fallback kicks in here
  return <GenericDetailsView details={details} />;
}
