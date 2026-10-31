import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { PRODUCT_ACTION, ProductActionId } from "../types";

import { redirectToLogin } from "@/lib/utils/redirectToLogin";
import { storePreAuthAction } from "@/lib/utils/navigation/storePreAuthAction";
import { sendTelemetry } from "@/lib/logger";
import { contactSellerHandler } from "./contactSellerHandler";
import { AdaptedProduct } from "@/domain/product/types/adapted-product.types";

type ProductActionHandlerDependencies = {
  router: AppRouterInstance;

  user: unknown;

  quantity: number;

  addItem: (payload: {
    product: string;
    name: string;
    price: number;
    image?: string;
    sellerId?: string;
    sellerName?: string;
    quantity: number;
  }) => Promise<void>;

  product: AdaptedProduct;
};

export function createProductActionHandlers({
  router,
  user,
  quantity,
  addItem,
  product,
}: ProductActionHandlerDependencies): Record<
  ProductActionId,
  () => Promise<void> | void
> {
  return {
    [PRODUCT_ACTION.ADD_TO_CART]: async () => {
      await addItem({
        product: product.id ?? "",
        name: product.name,
        price: product.price.effective,
        image: product.images?.[0],
        sellerId: product.seller?.id,
        sellerName: product.seller?.businessName ?? product.seller?.name,
        quantity,
      });

      sendTelemetry("cart_item_added", {
        productId: product.id,
        sellerId: product.seller?.id,
        quantity,
      });

      router.push("/cart");
    },

    [PRODUCT_ACTION.BUY_NOW]: () => {
      const checkoutUrl = `/checkout?${new URLSearchParams({
        product: product.id,
        quantity: String(quantity),
      })}`;

      if (!user) {
        storePreAuthAction({
          type: "checkout",
          path: checkoutUrl,
        });

        sendTelemetry("unauthenticated_checkout_attempt", {
          productId: product.id,
          quantity,
        });

        redirectToLogin(router, {
          redirect: checkoutUrl,
        });

        return;
      }

      router.push(checkoutUrl);
    },

    [PRODUCT_ACTION.CONTACT_SELLER]: () => {
      contactSellerHandler({
        seller: product?.seller,
        productId: product.id,
        productName: product.name
      });
    },
  };
}
