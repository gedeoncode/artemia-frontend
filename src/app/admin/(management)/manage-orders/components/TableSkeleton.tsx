// app/admin/manage-orders/OrdersTableSkeleton.tsx
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export function OrdersTableSkeleton() {
  return (
    <div className="w-full overflow-hidden border rounded-lg">
      <TableSkeleton
        rowCount={5}
        columnCount={7}
        headers={["Order ID", "Customer", "Date", "Status", "Total","Handled By", "Actions"]}
      />
    </div>
  );
}

