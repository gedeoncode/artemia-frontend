"use client";

import { memo } from "react";
import { Order, Lead } from "../../types/dashboard.types";

type ActivitySectionProps = {
  orders: Order[];
  leads: Lead[];
  onNavigate: (path: string) => void;
};

export const ActivitySection = memo(function ActivitySection({
  orders,
  leads,
  onNavigate,
}: ActivitySectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-medium text-gray-900">Recent Orders</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order._id}
              className="px-6 py-4 transition-colors cursor-pointer hover:bg-gray-50"
              onClick={() => onNavigate(`/seller/orders/${order._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate(`/seller/orders/${order._id}`);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.user?.name} •{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full mt-1 ${
                      order.status === "completed"
                        ? "bg-green-50 text-green-700"
                        : order.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={() => onNavigate("/seller/orders")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all orders →
          </button>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-medium text-gray-900">Recent Leads</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {leads.slice(0, 5).map((lead) => (
            <div
              key={lead._id}
              className="px-6 py-4 transition-colors cursor-pointer hover:bg-gray-50"
              onClick={() => onNavigate(`/seller/leads/${lead._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate(`/seller/leads/${lead._id}`);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.customer?.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lead.product?.name} • {lead.contactMethod}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${
                    lead.status === "converted"
                      ? "bg-green-50 text-green-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={() => onNavigate("/seller/leads")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all leads →
          </button>
        </div>
      </div>
    </div>
  );
});
