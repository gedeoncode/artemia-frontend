import { requireRole } from "@/domain/auth/guard/require-role";
import { MobileSidebarToggle } from "@/domain/admin/components/MobileSidebarToggle";
import Sidebar from "@/domain/admin/components/Sidebar";
import { UserRole } from "@/types";
import { connection } from "next/server";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await connection()
  const user = await requireRole([UserRole.ADMIN]);
  return (
    <div className="flex min-h-screen">
      <MobileSidebarToggle />

      <Sidebar role={user.role} />
      <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
