"use client";

import { memo } from "react";
import { MapPin, Package, Truck, Globe, Building2, MapPinned } from "lucide-react";
import { Shipping } from "@/domain/product/types";

interface ShippingTabProps {
  shipping?: Shipping;
}

export const ShippingTab = memo(function ShippingTab({
  shipping,
}: ShippingTabProps) {
  const location = shipping?.location;

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Truck className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Shipping information unavailable</p>
        <p className="text-sm text-gray-400 mt-1">
          This product doesn't have shipping details listed.
        </p>
      </div>
    );
  }

  // Define location fields with their labels and icons
  const locationFields = [
    { key: 'country' as const, label: 'Country', icon: Globe },
    { key: 'province' as const, label: 'Province/State', icon: Building2 },
    { key: 'city' as const, label: 'City', icon: Building2 },
    { key: 'commune' as const, label: 'Commune/District', icon: MapPinned },
    { key: 'quartier' as const, label: 'Neighborhood', icon: MapPinned },
    { key: 'avenue' as const, label: 'Street/Avenue', icon: MapPinned },
  ];

  const hasLocationDetails = locationFields.some(
    field => location[field.key] !== undefined && location[field.key] !== ''
  );

  if (!hasLocationDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <MapPin className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No location details available</p>
        <p className="text-sm text-gray-400 mt-1">
          The shipping location hasn't been specified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b  pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-50 p-2">
            <Truck className="w-5 h-5 text-primary-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Product shipping location and details
            </p>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-primary-50/50 to-transparent border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-gray-900">Shipping Origin</h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {locationFields.map(({ key, label, icon: Icon }) => {
            const value = location[key];
            if (!value) return null;

            return (
              <div
                key={key}
                className="flex items-start gap-3 text-sm group hover:bg-gray-50/50 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-500 font-medium">{label}:</span>
                  <span className="ml-2 text-gray-900 font-medium break-words">
                    {value}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Shipping Badge */}
        <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Package className="w-3.5 h-3.5" />
            <span>Ships from this location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-green-700 font-medium">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
});