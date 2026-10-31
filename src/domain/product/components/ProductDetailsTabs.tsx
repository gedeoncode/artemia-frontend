// Supporting Components

import { cn } from "@/lib";
import { memo, useState } from "react";

export const ProductDetailsTabs = memo(function ProductDetailsTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "returns">("details");

  const tabs = [
    { id: "details", label: "Product Details", content: product.details },
    { id: "shipping", label: "Shipping Info", content: product.shippingInfo },
    { id: "returns", label: "Returns Policy", content: product.returnsPolicy }
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 px-6" aria-label="Product information tabs">
          {tabs.map(tab => tab.content && (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6" role="tabpanel">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
});