import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/button/Button";
import { Truck, MapPin, Package, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/";

export function ShippingInfoCard({ order }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Shipping Details</h2>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Address Section */}
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-medium">{order.customerName || "Recipient"}</p>
              <p className="text-sm">{order.deliveryAddress.addressLine}</p>
              <p className="text-sm text-muted-foreground">
                {order.deliveryAddress.city}, {order.region}{" "}
                {order.deliveryAddress.postalCode}
              </p>
              {order.deliveryAddress.notes && (
                <div className="p-2 mt-2 text-sm border rounded-md bg-amber-50/50 border-amber-100">
                  <p className="font-medium text-amber-800">Delivery Notes:</p>
                  <p className="text-amber-700">
                    {order.deliveryAddress.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Timeline */}
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-sm text-muted-foreground">
                {order.estimatedDelivery
                  ? formatDate(order.estimatedDelivery)
                  : "Not available"}
              </p>
              {order.shippedAt && (
                <p className="text-xs text-green-600">
                  Shipped on {formatDate(order.shippedAt)}
                </p>
              )}
            </div>
          </div>

          {/* Tracking Section */}
          {order.trackingNumber && (
            <div className="flex gap-3 pt-3 border-t">
              <Package className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="w-full space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Tracking Information</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingCarrier || "Carrier"}:{" "}
                      {order.trackingNumber}
                    </p>
                  </div>
                  {order.trackingUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5"
                      asChild
                    >
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Track Package
                      </a>
                    </Button>
                  )}
                </div>

                {/* Tracking Progress (example) */}
                {order.shippingStatus && (
                  <div className="mt-2">
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div
                        className={`h-full ${
                          order.shippingStatus === "delivered"
                            ? "bg-green-500"
                            : "bg-primary"
                        }`}
                        style={{
                          width:
                            order.shippingStatus === "shipped" ? "50%" : "100%",
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      Status: {order.shippingStatus}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
