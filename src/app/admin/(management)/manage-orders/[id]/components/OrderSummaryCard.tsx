import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { InfoItem } from "./InfoItem";
import { Badge } from "@/components/ui/Badge";
import { memo } from "react";

// Predefined date formatter to avoid recreating functions
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const OrderSummaryCard = memo(function OrderSummaryCard({
  order,
  status,
}) {
  // Calculate values once
  const orderTotal = `${order.currency || "$"} ${order?.totalPrice?.toFixed(2)}`;
  const orderDate = formatDateTime(order.createdAt);
  const deliveryDate = order?.deliveryDate
    ? formatDate(order.deliveryDate)
    : "N/A";

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
          <InfoItem
            label="Order ID"
            value={order.orderId}
            loading={!order.orderId}
          />
          <InfoItem
            label="Status"
            value={<Badge variant="outline">{status}</Badge>}
            loading={!status}
          />
          <InfoItem
            label="Order Date"
            value={orderDate}
            loading={!order.createdAt}
          />
          <InfoItem
            label="Total"
            value={orderTotal}
            loading={!order.totalPrice}
          />
          <InfoItem
            label="Handled By"
            value={order.handledBy || "System"}
            loading={!order.handledBy}
          />
          <InfoItem
            label="Courier"
            value={order.shippingProvider || "Standard"}
            loading={!order.shippingProvider}
          />
          <InfoItem
            label="Delivery Method"
            value={order.deliveryMethod || "Standard"}
            loading={!order.deliveryMethod}
          />
          <InfoItem
            label="ETA"
            value={deliveryDate}
            loading={!order.deliveryDate}
          />
        </div>
      </CardContent>
    </Card>
  );
});
