// app/checkout/page.tsx

import { ProductItem } from "../../../domain/checkout/types/types";
import { CheckoutClientPage } from "@/domain/checkout/components/CheckoutClientPage";
import { getCheckoutProduct } from "@/domain/checkout/services/server/chekout.services";

interface CheckoutPageProps {
  searchParams: Promise<{
    product?: string;
    quantity?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;

  const productId = params.product;
  const quantity = Number.parseInt(params.quantity ?? "1", 10);

  let buyNowItem: ProductItem | null = null;

  if (productId) {
    const { product } = await getCheckoutProduct(productId);

    buyNowItem = {
      product: product._id,
      quantity,
      price: product.pricing.price,
      currency: product.pricing.currency,
      name: product.name,
      image: product.images?.[0] ?? "",
    };
  }

  return <CheckoutClientPage buyNowItem={buyNowItem} isBuyNow={!!productId} />;
}
