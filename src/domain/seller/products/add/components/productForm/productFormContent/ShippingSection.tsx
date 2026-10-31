"use client";

import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Info } from "lucide-react";
import type { ProductFormData } from "../../../../types/product.types";
import { EmptyState } from "@/components/EmptyState";
import Button from "@/components/ui/button/Button";
import { Label } from "@/components/ui/Label";
import { AlertMessage } from "@/components/error/AlertMessage";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "../../ui/SectionHeader";
import { cn } from "@/lib/utils/";

interface FulfillmentSectionProps {
  registerStepValidity: (step: number, isValid: boolean) => void;
  stepIndex?: number;
  sellerWarehouseAddress?: string; // added for reusing warehouse info
  supportedHubs?: { id: string; name: string; city: string }[]; // allow dynamic hub list
  className: string;
}

export function ShippingSection({
  registerStepValidity,
  stepIndex,
  sellerWarehouseAddress = "Kisumu",
  supportedHubs = [
    { id: "nairobi_cbd", name: "Nairobi CBD Hub", city: "Nairobi" },
    { id: "mombasa_hub", name: "Mombasa Hub", city: "Mombasa" },
    { id: "kisumu_hub", name: "Kisumu Hub", city: "Kisumu" },
  ],
  className,
}: FulfillmentSectionProps) {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<ProductFormData>();

  // --- Watch form values ---
  const saleMode = useWatch({ control, name: "saleMode" }); // "PAP" or "PAL"
  const handoverMethod = useWatch({ control, name: "handoverMethod" });
  const pickupLocation = useWatch({ control, name: "pickupLocation" });
  const dropoffHub = useWatch({ control, name: "dropoffHub" });
  const deliveryMethod = useWatch({ control, name: "deliveryMethod" });
  const estimatedTime = useWatch({ control, name: "estimatedTime" });
  const physicalProduct = useWatch({ control, name: "physicalProduct" });
  const weight = useWatch({ control, name: "weight" });
  const countryOfOrigin = useWatch({ control, name: "countryOfOrigin" });

  const isPAL = "PAL";
  const isPhysical = Boolean(physicalProduct);

  // --- Validation logic ---
  const isShippingValid = useMemo(() => {
    if (!isPhysical) return true;

    if (isPAL) {
      if (!handoverMethod) return false;
      if (handoverMethod === "pickup" && !pickupLocation?.trim()) return false;
      if (handoverMethod === "dropoff" && !dropoffHub?.trim()) return false;
      return true;
    }

    // PAP mode
    return Boolean(deliveryMethod?.trim() && estimatedTime?.trim());
  }, [
    isPAL,
    isPhysical,
    handoverMethod,
    pickupLocation,
    dropoffHub,
    deliveryMethod,
    estimatedTime,
  ]);

  const isBaseValid = useMemo(() => {
    if (!isPhysical) return true;
    // return (
    //   weight !== undefined && weight >= 0 && Boolean(countryOfOrigin?.trim())
    // );
    return true;
  }, [isPhysical]);

  const isValid = isShippingValid && isBaseValid;
  console.log("className from shipping:", className);

  // --- Register step validity ---
  useEffect(() => {
    registerStepValidity(stepIndex, isValid);
  }, [isValid, stepIndex, registerStepValidity]);

  // --- Non-physical ---
  if (!isPhysical) {
    return (
      <EmptyState
        description=" Shipping options are not required for digital products. 
              Your customers will receive instant access upon purchase."
        title="Digital Product"
        className="p-5 border border-gray-200 rounded-lg bg-gray-50"
      />
    );
  }

  return (
    <section className={cn("mb-4", className)}>
      <SectionHeader
        title="Fulfillment & Delivery"
        description={
          <div className="flex items-start max-w-2xl gap-2 text-sm text-gray-700">
            <Info className="w-4 h-4 mt-[2px] text-gray-500" />
            {isPAL ? (
              <p>
                <strong>Pay at Delivery (PAL):</strong> The platform handles
                customer delivery. Choose how you’ll hand over items to us.
              </p>
            ) : (
              <p>
                <strong>Pay at Publication (PAP):</strong> You’ll deliver items
                directly to customers. Provide your delivery setup below.
              </p>
            )}
          </div>
        }
      />

      {/* --- PAL MODE --- */}
      {isPAL && (
        <div className="space-y-5">
          {/* Handover method */}
          <div>
            <Label htmlFor="handoverMethod">
              How will the platform collect your items?
            </Label>
            <select
              {...register("handoverMethod", {
                required: "Please choose how you’ll hand over your products",
              })}
              className="block w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="">Select an option</option>
              <option value="pickup">Platform Pickup from My Warehouse</option>
              <option value="dropoff">I’ll Drop Off at a Platform Hub</option>
            </select>
            {errors.handoverMethod && (
              <AlertMessage message={errors.handoverMethod.message} />
            )}
          </div>

          {/* Pickup Option */}
          {handoverMethod === "pickup" && (
            <div>
              <Label htmlFor="pickupLocation">Pickup Address</Label>

              {/* Offer reuse */}
              {sellerWarehouseAddress && (
                <Button
                  variant="link"
                  type="button"
                  onClick={() =>
                    setValue("pickupLocation", sellerWarehouseAddress)
                  }
                  className="text-xs "
                >
                  Use my saved warehouse address
                </Button>
              )}

              <Input
                type="text"
                {...register("pickupLocation", {
                  required: "Pickup location is required",
                })}
                placeholder="e.g. Tom Mboya Street, Nairobi"
              />
              {errors.pickupLocation && (
                <AlertMessage
                  variant="error"
                  message={errors.pickupLocation.message as string}
                />
              )}

              <p className="mt-1 text-xs text-gray-500">
                Pickup service is free within city limits. Extra distance may
                incur a small logistics fee.
              </p>
            </div>
          )}

          {/* Dropoff Option */}
          {handoverMethod === "dropoff" && (
            <div>
              <Label htmlFor="dropoffHub">Choose Drop-off Hub</Label>
              <select
                {...register("dropoffHub", {
                  required: "Please select a hub for drop-off",
                })}
                className="block w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
              >
                <option value="">Select a hub</option>
                {supportedHubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.city})
                  </option>
                ))}
                <option value="other">My area isn’t listed</option>
              </select>

              {dropoffHub === "other" && (
                <div className="mt-2">
                  <Input
                    type="text"
                    {...register("customDropoffNote")}
                    placeholder="Enter your nearest major town or hub request"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Our logistics team will contact you to confirm availability.
                  </p>
                </div>
              )}

              {errors.dropoffHub && (
                <AlertMessage
                  variant="error"
                  message={errors.dropoffHub.message as string}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* --- PAP MODE --- */}
      {!isPAL && (
        <div className="space-y-5">
          <div>
            <lLbel htmlFor="deliveryMethod">Delivery Method</lLbel>
            <select
              {...register("deliveryMethod", {
                required: "Please select how you’ll deliver items",
              })}
              className="block w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="">Select method</option>
              <option value="own_delivery">My Own Delivery</option>
              <option value="pickup">Customer Pickup</option>
              <option value="courier">Local Courier Service</option>
            </select>
            {errors.deliveryMethod && (
              <AlertMessage
                variant="error"
                message={errors.deliveryMethod.message as string}
              />
            )}
          </div>

          <div>
            <Label htmlFor="estimatedTime">Estimated Delivery Time</Label>
            <Input
              type="text"
              {...register("estimatedTime", {
                required: "Estimated time is required",
              })}
              placeholder="e.g. 1–2 business days"
            />
            {errors.estimatedTime && (
              <AlertMessage
                variant="error"
                message={errors.estimatedTime.message as string}
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              Set realistic timelines — customers see this on your listing.
            </p>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          You can update delivery preferences anytime under{" "}
          <strong>Product Settings → Fulfillment</strong>. Certain delivery
          options may include small handling fees shown during order creation.
        </p>
      </div>
    </section>
  );
}
