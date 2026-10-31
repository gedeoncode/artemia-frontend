import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { logger } from "@/lib/logger";

import { fetchAddressByIdApi } from "../../services/client/reviewClient.services";
import { Address, ProductItem } from "../../types/types";
import { CHECKOUT_REVIEW_KEY } from "../../services/client/checkoutStorage";

type PaymentMethod =
  | "cash_on_delivery"
  | "mobile_money";

export function useReviewOrderData() {
  const router = useRouter();

  const [address, setAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash_on_delivery");

  const [deliveryDate, setDeliveryDate] =
    useState("");

  const [cartItems, setCartItems] =
    useState<ProductItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CHECKOUT_REVIEW_KEY);

    if (!stored) {
      router.push("/checkout");
      return;
    }

    const load = async () => {
      try {
        const parsed = JSON.parse(stored);

        setPaymentMethod(
          parsed.paymentMethod ?? "cash_on_delivery"
        );

        setDeliveryDate(
          parsed.deliveryDate ?? ""
        );

        setCartItems(
          parsed.products ?? []
        );

        const savedAddress = parsed.address;

        if (!savedAddress) return;

        if (
          "_id" in savedAddress &&
          !savedAddress.fullName
        ) {
          setAddressLoading(true);

          try {
            const { data } =
              await fetchAddressByIdApi(
                savedAddress._id
              );

            setAddress(data);
          } catch (error) {
            logger.error(
              "Failed to fetch address",
              error
            );
          } finally {
            setAddressLoading(false);
          }

          return;
        }

        setAddress(savedAddress);
      } catch (error) {
        logger.error(
          "checkout-review parse error",
          error
        );
      }
    };

    void load();
  }, [router]);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (item.price ?? 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  const currency = cartItems[0]?.currency;

  return {
    address,
    addressLoading,

    paymentMethod,
    deliveryDate,
    cartItems,

    totalPrice,
    currency,
  };
}