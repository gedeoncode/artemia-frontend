"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button/Button";
import { formatCurrency } from "@/lib";

import {
  CheckCircle,
  ChevronLeft,
  CreditCard,
  Loader2,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import { useReviewOrderData } from "./hooks/useReviewOrderData";
import { useReviewOrderSubmission } from "./hooks/useReviewOrderSubmission";
import { useCheckoutNotifications } from "./hooks/useCheckoutNotifications";

export function ReviewOrderClientPage() {
  const router = useRouter();

  const {
    address,
    addressLoading,
    paymentMethod,
    deliveryDate,
    cartItems,
    totalPrice,
    currency,
  } = useReviewOrderData();

  const { confirmOrder, loading, error, success } = useReviewOrderSubmission({
    address,
    cartItems,
    paymentMethod,
    deliveryDate,
  });

  useCheckoutNotifications({
    success,
    error,
  });

  const formatPaymentMethod = (method: "cash_on_delivery" | "mobile_money") =>
    method === "mobile_money" ? "Mobile Money" : "Cash on Delivery";

  return (
    <div className="">
      {/* Main container with max-width and padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-600 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN - Review workflow */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header - Primary */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Review your order
              </h1>

              <p className="flex items-center gap-2 text-sm text-gray-500">
                <ShoppingBag className="w-4 h-4" />
                <span className="font-medium text-gray-700">
                  {cartItems.length}
                </span>
                {cartItems.length === 1 ? "item" : "items"} in your order
              </p>
            </div>

            {/* Delivery Address Section */}
            <section aria-labelledby="delivery-heading">
              <div className="space-y-4">
                <div>
                  <h2
                    id="delivery-heading"
                    className="text-sm font-medium text-gray-900 uppercase tracking-wide"
                  >
                    Delivery Address
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>

                {/* Subtle separator */}
                <div className="pt-4 border-t border-gray-200/80">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      {addressLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Loading address...
                        </div>
                      ) : address ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">
                            {address.fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.neighborhood}, {address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                          {address.deliveryInstructions && (
                            <p className="pt-1 text-sm text-gray-500">
                              {address.deliveryInstructions}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No delivery address selected
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 whitespace-nowrap ml-6"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method Section */}
            <section aria-labelledby="payment-heading">
              <div className="space-y-4">
                <div>
                  <h2
                    id="payment-heading"
                    className="text-sm font-medium text-gray-900 uppercase tracking-wide"
                  >
                    Payment Method
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    How would you like to pay?
                  </p>
                </div>

                {/* Subtle separator */}
                <div className="pt-4 border-t border-gray-200/80">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatPaymentMethod(paymentMethod)}
                        </span>
                      </div>
                      {deliveryDate && (
                        <p className="text-sm text-gray-500">
                          Estimated delivery:{" "}
                          {new Date(deliveryDate).toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 whitespace-nowrap ml-6"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Sticky summary panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Summary header */}
                <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                    Order Summary
                  </h2>
                </div>

                {/* Items list */}
                <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(
                          (item.price || 0) * item.quantity,
                          currency,
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Total */}
                <div className="px-5 py-4 bg-gray-50/50">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-sm font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(totalPrice, currency)}
                    </span>
                  </div>

                  {/* Confirm Order Button */}
                  <div className="flex flex-col-reverse gap-3 md:flex-row">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-4 py-3 text-sm text-gray-400 transition-colors hover:text-gray-600 md:px-0"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      onClick={confirmOrder}
                      disabled={loading || addressLoading || !address}
                      isPending={loading}
                      loadingText="Confirming..."
                      leftIcon={<CheckCircle className="w-4 h-4 mr-2" />}
                      className="w-full px-8 py-3 text-sm font-medium md:w-auto"
                    >
                      Confirm Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
