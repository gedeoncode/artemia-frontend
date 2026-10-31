"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import { OrderDetailsSkeleton } from "./components/OrderSkeleton";
import { EmptyState, ErrorState } from "./components/ErrorEmptyState";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { ShippingInfoCard } from "./components/ShipingInfoCard";
import { ActionsCard } from "./components/ActionCard";
import { ProductsCard } from "./components/ProductCard";
import { StatusChangeDialog } from "./components/StatusChangeDialog";

export default function AdminOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/orders/${id}`, {
          next: { revalidate: 60 }, // Cache with revalidation
        });

        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        console.log(data);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusSelect = (value) => {
    setNextStatus(value);
    setConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStatus(nextStatus);
      setOrder((prev) => ({ ...prev, status: nextStatus }));
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <OrderDetailsSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!order) return <EmptyState />;

  return (
    <div className="p-6 mx-auto space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
        {/* <Button variant="outline" onClick={() => router.back()}> */}
        <Button variant="outline">Back to Orders</Button>
      </div>

      {/* Order Summary */}
      <OrderSummaryCard order={order} status={status} />

      {/* Two-column layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipping Info */}
        <ShippingInfoCard order={order} />

        {/* Actions */}
        <ActionsCard
          status={status}
          onStatusChange={handleStatusSelect}
          updating={updating}
        />
      </div>

      {/* Products List */}
      <ProductsCard order={order} />

      {/* Status Change Confirmation */}
      <StatusChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        nextStatus={nextStatus}
        onConfirm={confirmStatusChange}
        updating={updating}
      />
    </div>
  );
}
