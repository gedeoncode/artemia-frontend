"use client";

import { memo, useCallback, Suspense, useState } from "react";

import {
  DescriptionTab,
  SpecificationsTab,
//   ReviewsTab,
  ShippingTab,
} from "./tabs";

import { AdaptedProduct } from "../../types/adapted-product.types";

interface ProductTabsProps {
  product: AdaptedProduct;
}

type TabId = "description" | "specifications" | "reviews" | "shipping";

export const ProductTabs = memo(function ProductTabs({
  product,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  const tabs = [
    {
      id: "description" as const,
      label: "Description",
      count: null,
    },

    {
      id: "specifications" as const,
      label: "Specifications",
      count: Object.keys(product.details ?? {}).length,
    },

    {
      id: "reviews" as const,
      label: "Reviews",
      count: product.reviewCount ?? 0,
    },

    {
      id: "shipping" as const,
      label: "Shipping & Returns",
      count: null,
    },
  ];

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);

    history.pushState(null, "", `#${tabId}`);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <DescriptionTab
            description={product.description}
          />
        );

      case "specifications":
        return <SpecificationsTab specifications={product.details} />;

    //   case "reviews":
    //     return (
    //       <ReviewsTab
    //         productId={product.id}
    //         averageRating={product.rating}
    //         totalReviews={product.reviewCount}
    //       />
    //     );

      case "shipping":
        return <ShippingTab shipping={product.shipping} />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}

      <div className="border-b border-gray-200">
        <nav
          role="tablist"
          aria-label="Product information tabs"
          className="flex overflow-x-auto scrollbar-hide"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-panel-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex-shrink-0
                px-4 sm:px-6
                py-3 sm:py-4
                text-sm sm:text-base
                font-medium
                border-b-2
                transition-all duration-200

                ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : `
                      border-transparent
                      text-gray-500
                      hover:text-gray-700
                      hover:border-gray-300
                    `
                }
              `}
            >
              {tab.label}

              {tab.count !== null && (
                <span
                  className={`
                    ml-1.5
                    px-2 py-0.5
                    text-xs
                    rounded-full

                    ${
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}

      <div className="p-4 sm:p-6">
        <div
          role="tabpanel"
          tabIndex={0}
          className="focus:outline-none"
          id={`tab-panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <Suspense
            fallback={
              <div className="py-8 text-center">Loading content...</div>
            }
          >
            {renderTabContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
});
