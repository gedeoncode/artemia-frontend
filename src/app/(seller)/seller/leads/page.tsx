// app/seller/products/page.tsx

import { ManageLeadsScreen } from "@/domain/seller/leads/components/ManageLeadsScreen";
import { fetchSellerLeads } from "@/domain/seller/leads/services/seller.lead.services";
import { connection } from "next/server";

export default async function ManageLeadsPage() {
  await connection()
  const initialFilterParams = {
    status: "new",
    page: 1,
  };

  const initialData = await fetchSellerLeads();
  return (
    <ManageLeadsScreen
      initialData={initialData}
      initialFilterParams={initialFilterParams}
    />
  );
}
