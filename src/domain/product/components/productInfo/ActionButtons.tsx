"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";

import { redirectToLogin } from "@/lib/utils/redirectToLogin";
import { storePreAuthAction } from "@/lib/utils/navigation/storePreAuthAction";
import { logger, sendTelemetry } from "@/lib/logger";

import { getActions } from "../../utils/getActions";
import { toast } from "react-toastify";
import { UIProduct } from "../../types";
import { Action } from "../../types";
import { contactSellerHandler } from "../productHeroSection/stickyPurchasePanel/productActionsPanel/utils/contactSellerHandler";
import { AdaptedProduct } from "../../types/adapted-product.types";

export function ActionButtons({ product }: { product: AdaptedProduct }) {
  /** --------------------- VALIDATION --------------------- */

  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();

  /** UI States */
  const [quantity, setQuantity] = useState(1);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  /** --------------------- DESTRUCTURE PROPS --------------------- */
  const productId = product.id;
  const name = product.name;

  const price = product?.pricing?.price;
  const stock = product.inventory?.stock ?? 0;

  const sellerId = product.seller?.id;
  const sellerName = product.seller?.name;

  const productNature = product.category?.nature;
  const image = product.images?.[0];

  /** URL params for actions that redirect */
  const checkoutParams = useMemo(
    () =>
      new URLSearchParams({
        product: productId,
        quantity: String(quantity),
      }),
    [productId, quantity],
  );

  const maxSelectableQuantity = useMemo(() => Math.min(stock, 10), [stock]);

  /** ---------------------- HELPERS ----------------------- */
  const helpers = useMemo(
    () => ({
      addToCart: async () => {
        await addItem({
          product: productId,
          name,
          price,
          image,
          sellerId,
          sellerName,
          quantity,
        });

        sendTelemetry("cart_item_added", {
          productId,
          sellerId,
          quantity,
          price,
        });

        router.push("/cart");
      },

      buyNow: () => {
        const checkoutUrl = `/checkout?${checkoutParams.toString()}`;

        if (!user) {
          storePreAuthAction({
            type: "checkout",
            path: checkoutUrl,
          });

          sendTelemetry("unauthenticated_checkout_attempt", {
            productId,
            quantity,
          });

          redirectToLogin(router, { redirect: checkoutUrl });
          return;
        }

        router.push(checkoutUrl);
      },

      scheduleViewing: () =>
        router.push(`/viewing/schedule?product=${productId}`),
      contactAgent: () => contactSellerHandler(product),
      bookService: () => router.push(`/service/book?product=${productId}`),
      bookSpace: () => router.push(`/space/book?product=${productId}`),
      checkAvailability: () =>
        router.push(`/availability?product=${productId}`),
      scheduleTestDrive: () => router.push(`/drive/book?product=${productId}`),
      contactSeller: () => contactSellerHandler(product),
      downloadDemo: () => router.push(`/demo/download?product=${productId}`),
      requestQuote: () => router.push(`/service/quote?product=${productId}`),
    }),
    [
      addItem,
      product,
      productId,
      name,
      price,
      image,
      sellerId,
      sellerName,
      quantity,
      router,
      checkoutParams,
      user,
    ],
  );

  /** ------------------- ACTION SYSTEM -------------------- */
  const actions = useMemo(
    () => getActions(productNature, helpers),
    [productNature, helpers],
  );

  const runAction = useCallback(
    async (action: Action) => {
      setProcessingAction(action.id);
      try {
        await action.handler(helpers);
      } catch (error) {
        logger.error(`Action ${action.id} failed`, { error });
        toast.error("Something went wrong. Please try again.");
      } finally {
        setProcessingAction(null);
      }
    },
    [helpers],
  );

  const quantityOptions = useMemo(
    () => Array.from({ length: maxSelectableQuantity }, (_, i) => i + 1),
    [maxSelectableQuantity],
  );

  return (
    <div className="space-y-4" aria-live="polite">
      {productNature === "physical" && (
        <div className="flex items-center">
          <label htmlFor="quantity" className="mr-2 text-sm font-medium">
            Quantity:
          </label>

          <select
            id="quantity"
            value={quantity}
            disabled={!!processingAction}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md"
          >
            {quantityOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <span className="ml-2 text-sm text-gray-500">{stock} available</span>
        </div>
      )}

      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => runAction(action)}
          disabled={!!processingAction}
          aria-disabled={!!processingAction}
          className={`w-full px-6 py-3 font-medium rounded-md transition ${
            action.primary
              ? "text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90"
              : "text-blue-600 bg-white border border-blue-500 hover:bg-blue-50"
          } disabled:opacity-60`}
        >
          {processingAction === action.id ? "Processing..." : action.label}
        </button>
      ))}
    </div>
  );
}
