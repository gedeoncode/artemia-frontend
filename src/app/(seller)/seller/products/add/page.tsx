// app/seller/add-product/page.tsx (SERVER COMPONENT)

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { AddProductScreen } from "@/domain/seller/products/add/components";
import { getSellerCategories } from "@/lib/api";
import { categoryKeys } from "@/lib/react-query/category-keys";
import { connection } from "next/server";

export default async function Page() {
  await connection();
  const queryClient = new QueryClient();
  // Server prefetch
  await queryClient.prefetchQuery({
    queryKey: categoryKeys.all,
    queryFn: getSellerCategories,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddProductScreen />
    </HydrationBoundary>
  );
}
