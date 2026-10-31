import { requireRole } from "@/domain/auth/guard/require-role";
import ClientDashboardLayout from "@/domain/seller/dashboard/components/ClientLayout";
import { getSellerShell } from "@/domain/seller/dashboard/services";
import { UserRole } from "@/types";
import { connection } from "next/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection()
  const user = await requireRole([UserRole.SELLER]);

  const dashboardData = await getSellerShell();

  return (
    <ClientDashboardLayout
      seller={user}
      unreadCount={dashboardData?.data.unReadNotification}
    >
      {children}
    </ClientDashboardLayout>
  );
}
