import { ProductsTableSkeleton, ProductTableRow } from "../components";
import { Product } from "@/domain/admin/products/types";

  export const renderSkeleton = () => (
    <ProductsTableSkeleton />
  );

 export const renderProductRow = (product: Product, selectedIds,) => (
    <ProductTableRow
      key={product._id.toString()}
      product={product}
      selected={selectedIds.includes(
        product._id.toString(),
      )}
      onToggleSelect={toggleSelection}
      onView={openProductModal}
      onSingleAction={handleSingleAction}
      onToggleFlag={toggleProductFlag}
    />
  );