"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

import { useCart } from "../../../hooks/useCart";
import { Address, ProductItem } from "../types/types";
import { CheckoutFooter } from "./CheckoutFooter";
import { AddressSection } from "./AddressSection";
import { formatCurrency } from "@/lib";

interface CheckoutClientProps {
  buyNowItem: ProductItem | null;
  isBuyNow: boolean;
}

export const CheckoutClientPage = ({
  buyNowItem,
  isBuyNow,
}: CheckoutClientProps) => {
  const router = useRouter();
  const { cartItems } = useCart();

  // --------------------------------------------------
  // Address state
  // --------------------------------------------------
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [newAddress, setNewAddress] = useState<Address | null>(null);

  // --------------------------------------------------
  // Active checkout items
  // --------------------------------------------------
  const activeItems = useMemo<ProductItem[]>(() => {
    if (isBuyNow && buyNowItem) {
      return [buyNowItem];
    }

    return cartItems;
  }, [buyNowItem, cartItems, isBuyNow]);
  const currency = activeItems[0]?.currency;
  // --------------------------------------------------
  // Total
  // --------------------------------------------------
  const totalPrice = useMemo(() => {
    return activeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [activeItems]);

  // --------------------------------------------------
  // Redirect if cart is empty
  // --------------------------------------------------
  useEffect(() => {
    if (!isBuyNow && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems.length, isBuyNow, router]);

  // --------------------------------------------------
  // Address selection
  // --------------------------------------------------
  const handleAddressChange = (
    selection:
      | { type: "existing"; id: string }
      | { type: "new"; data: Address }
      | { type: "none" },
  ) => {
    switch (selection.type) {
      case "existing":
        setSelectedAddressId(selection.id);
        setNewAddress(null);
        break;

      case "new":
        setSelectedAddressId(null);
        setNewAddress(selection.data);
        break;

      default:
        setSelectedAddressId(null);
        setNewAddress(null);
    }
  };

  // Empty cart state
  if (!isBuyNow && cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 md:px-8">
        <div className="text-center">
          <p className="text-gray-600">Votre panier est vide </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" ">
      {/* Main container with max-width and padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN - Workflow */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header - Primary */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Finalisez votre commande
              </h1>

              <p className="flex items-center gap-2 text-sm text-gray-500">
                {isBuyNow ? (
                  <>
                    <Package className="w-4 h-4" />
                    Achat d&apos;un seul article
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-700">
                      {cartItems.length}
                    </span>
                    {cartItems.length === 1 ? "article" : "articles"} dans votre
                    panier
                  </>
                )}
              </p>
            </div>

            {/* Delivery Address - Secondary */}
            <section aria-labelledby="delivery-heading">
              <div className="space-y-4">
                <div>
                  <h2
                    id="delivery-heading"
                    className="text-sm font-medium text-gray-900 uppercase tracking-wide"
                  >
                    Adresse de livraison
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Où souhaitez-vous recevoir votre commande ?
                  </p>
                </div>

                {/* Subtle separator instead of full card */}
                <div className="pt-4 border-t border-gray-200/80">
                  <AddressSection onAddressSelect={handleAddressChange} />
                </div>
              </div>
            </section>

            {/* Future sections with subtle separation */}
          </div>

          {/* RIGHT COLUMN - Decision Panel */}
          <div className="lg:col-span-4">
            {/* Sticky order summary - Single Anchor Card */}
            <div className="sticky top-6">
              <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Summary header */}
                <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                    Récapitulatif
                  </h2>
                </div>

                {/* Items list */}
                <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
                  {activeItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity, currency)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Pricing */}
                <div className="px-5 py-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="text-gray-900">
                      {formatCurrency(totalPrice, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="text-gray-900">À calculer</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Total + CTA */}
                <div className="px-5 py-4 bg-gray-50/50">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-sm font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(totalPrice, currency)}
                    </span>
                  </div>

                  {/* The actual checkout component */}
                  <CheckoutFooter
                    cartItems={activeItems}
                    totalPrice={totalPrice}
                    addressId={selectedAddressId}
                    newAddress={newAddress}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
