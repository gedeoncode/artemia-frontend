"use client";

import { memo } from "react";

import { Store, Star, Shield, Clock, MapPin } from "lucide-react";
import { AdaptedSeller } from "@/domain/product/types/adapted-product.types";

interface SellerInformationCardProps {
  seller: AdaptedSeller;
}

export const SellerInformationCard = memo(function SellerInformationCard({
  seller,
}: SellerInformationCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Seller Information
      </h3>

      <div className="flex items-start gap-3">
        {/* Avatar */}

        <div
          className="
              flex-shrink-0
              w-10 h-10

              rounded-full

              bg-primary-100

              flex
              items-center
              justify-center
            "
        >
          <Store className="w-5 h-5 text-primary-600" aria-hidden="true" />
        </div>

        {/* Content */}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">
              {seller.businessName ?? seller.name}
            </span>

            {seller.verified && (
              <Shield className="w-4 h-4 text-primary-500" aria-hidden="true" />
            )}
          </div>

          {seller.sellerType && (
            <p className="text-xs text-gray-500 mt-0.5 capitalize">
              {seller.sellerType}
            </p>
          )}

     

          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            {seller.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" aria-hidden="true" />

                {seller.location}
              </span>
            )}

            {seller.responseTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" aria-hidden="true" />

                {seller.responseTime}
              </span>
            )}

            {seller.since && <span>Since {seller.since}</span>}
          </div>

          {seller.onlineSince && (
            <div className="mt-2">
              <span
                className="
                    inline-flex
                    items-center

                    px-2 py-1

                    rounded-full

                    bg-green-50
                    text-green-700

                    text-xs
                  "
              >
                <span
                  className="
                      w-1.5 h-1.5
                      rounded-full
                      bg-green-500
                      mr-1.5
                    "
                />
                Online
              </span>
            </div>
          )}
        </div>
      </div>

      {/* <button
        type="button"
        className="
            w-full

            text-sm
            font-medium

            text-primary-600
            hover:text-primary-700

            transition-colors
          "
        aria-label={`View ${seller.name}'s profile`}
      >
        View Seller Profile
      </button> */}
    </div>
  );
});
