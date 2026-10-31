// /ui/ProductLayout.tsx

import { UIProduct } from "@/domain/product/types";
import { VehicleLayout, RealEstateLayout, DefaultLayout } from ".";

type LayoutRegistry = Partial<
  Record<
    UIProduct["category"]["nature"],
    React.ComponentType<{ product: UIProduct }>
  >
>;

const layoutRegistry: LayoutRegistry = {
  vehicle: VehicleLayout,
  "real-estate": RealEstateLayout,
};

type Props = {
  product: UIProduct;
};

export function ProductLayout({ product }: Props) {
  const nature = product.category?.nature;

  const Layout = nature ? layoutRegistry[nature] : null;

  // 🔥 Fallback instead of breaking UI
  if (!Layout) {
    return <DefaultLayout product={product} />;
  }

  return <Layout product={product} />;
}
