// app/seller/products/page.tsx

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { ManageProductsScreen } from "@/domain/seller/products/components";
import { fetchProducts } from "@/domain/seller/products/services";
import { ProductFilterParams } from "@/domain/seller/products/types/filter.types";
import { productKeys } from "@/lib/react-query/product-keys";
import { connection } from "next/server";

export default async function ManageProductsPage() {
  await connection()
  const initialFilterParams: ProductFilterParams = {
    page: 1,
  };

  const queryClient = new QueryClient();
try {
  await queryClient.prefetchQuery({
    queryKey: productKeys.list(initialFilterParams),
    queryFn: () => fetchProducts(initialFilterParams),
  });
} catch (e) {
  console.error(e);
  throw e;
}

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ManageProductsScreen initialFilterParams={initialFilterParams} />
    </HydrationBoundary>
  );
}
