import { ProductItem } from "./ProductItem";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export function ProductsCard({ order }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <h2 className="text-lg font-semibold">Order Items</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.products.map((item) => (
            <ProductItem
              key={item._id}
              item={item}
              currency={order.currency}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}