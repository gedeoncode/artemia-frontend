// components/admin/orders/OrderDetailsDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export function OrderDetailsDrawer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("view");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const closeDrawer = () => {
    router.replace("/admin/manage-orders", { scroll: false });
  };

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      axios
        .get(`/api/admin/orders/${orderId}`)
        .then((res) => setOrder(res.data))
        .finally(() => setLoading(false));
    }
  }, [orderId]);
  // Inside OrderDetailsDrawer

const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newStatus = e.target.value;
  if (!order?._id || newStatus === order.status) return;

  const confirmed = confirm(`Change status to "${newStatus}"?`);
  if (!confirmed) return;

  try {
    await axios.patch(`/api/admin/orders/${order._id}/status`, {
      status: newStatus,
    });

    // Optimistically update UI
    setOrder((prev) => ({ ...prev, status: newStatus }));
  } catch (err: any) {
    alert("Failed to update status.");
    console.error(err);
  }
};


  if (!orderId) return null;

  return (
    <Dialog open={!!orderId} onClose={closeDrawer} className="relative z-50">
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 w-full max-w-lg p-6 overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <button onClick={closeDrawer}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : order ? (
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Handled By:</strong> {order.handledBy}
              </p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Order Status
              </label>
              <select
                className="w-full px-3 py-1 text-sm border rounded"
                value={order.status}
                onChange={handleStatusChange}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">Buyer</h3>
              <p>{order.user?.name}</p>
              <p className="text-xs text-gray-500">{order.user?.email}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">Shipping</h3>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.country}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">Products</h3>
              <ul className="divide-y">
                {order.products.map((item: any) => (
                  <li key={item._id} className="py-2">
                    <p>{item.product?.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} | Seller: {item.seller?.businessName}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">Total</h3>
              <p>${order.totalAmount?.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Order not found.</p>
        )}
      </div>
    </Dialog>
  );
}
