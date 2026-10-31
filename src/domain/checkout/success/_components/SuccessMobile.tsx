"use client";

import { CheckCircle, Package, Truck } from "lucide-react";

import { ConfettiEffect } from "@/components/ui/ConfettiEffect";
import { Button } from "@/components/ui";

import { useSuccessPage } from "@/domain/checkout/success/hooks/useSuccessPage";

export default function SuccessMobile() {
  const { goHome, goToOrders } = useSuccessPage();

  return (
    <>
      <ConfettiEffect duration={4000} />

      <div className="">
        {/* Main container - matching checkout mobile padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Single column - centered content */}
          <div className="max-w-2xl mx-auto">
            {/* Card container - matching checkout summary styling */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                {/* Header with success icon */}
                <div className="space-y-3 text-center sm:space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-50">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                      Order confirmed
                    </h1>
                    <p className="text-sm text-gray-500">
                      Thank you for your order
                    </p>
                  </div>
                </div>

                {/* Subtle separator */}
                <div className="border-t border-gray-200/80" />

                {/* Order Received Section - matching checkout section style */}
                <section aria-labelledby="order-received-heading">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h2
                        id="order-received-heading"
                        className="text-sm font-medium text-gray-900 uppercase tracking-wide flex items-center gap-2 sm:gap-3"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        Order Received
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        We're getting everything ready for you.
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-200/80">
                      <p className="text-sm text-gray-600">
                        You'll receive updates when your order has been packed.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Delivery Status Section - matching checkout section style */}
                <section aria-labelledby="delivery-status-heading">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h2
                        id="delivery-status-heading"
                        className="text-sm font-medium text-gray-900 uppercase tracking-wide flex items-center gap-2 sm:gap-3"
                      >
                        <Truck className="w-4 h-4 text-gray-400" />
                        Delivery Status
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Track your order's journey.
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-200/80">
                      <p className="text-sm text-gray-600">
                        You'll be notified once your order is dispatched.
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Feel free to continue shopping while your order is prepared.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Actions - matching checkout CTA styling */}
                <div className="pt-3 sm:pt-4 border-t border-gray-200/80">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={goHome}
                      className="flex-1 py-2 w-full sm:w-auto"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={goToOrders}
                      className="flex-1 w-full sm:w-auto"
                    >
                      View My Orders
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}