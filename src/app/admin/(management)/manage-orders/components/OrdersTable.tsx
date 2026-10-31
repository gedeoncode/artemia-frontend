// components/admin/orders/OrdersTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/";
import { Loader } from "lucide-react";
import { OrdersTableProps } from "../services/types";

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-green-100 text-green-800",
    delivered: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-600 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Handled By</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 bg-white divide-y">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="p-6 text-center">
                <Loader className="w-5 h-5 mx-auto animate-spin" />
                <span className="sr-only">Loading orders...</span>
              </td>
            </tr>
          ) : orders?.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-600">
                  {order._id.slice(-6)}
                </td>
                <td className="px-4 py-3">
                  {order.client?.name || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  ${order.totalPrice?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded capitalize ${
                      statusClasses[
                        order.status as keyof typeof statusClasses
                      ] || statusClasses.default
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize">
                  {order.handledBy || (
                    <span className="text-gray-400">System</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/manage-orders/${order._id}`}
                    className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-900"
                    title={`View details for admin ${order._id}`}
                    prefetch={false}
                  >
                    View Details
                    <span className="sr-only">
                      for admin {order?._id?.slice(-6) ?? "unknown"}
                    </span>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
