// app/seller/notifications/page.tsx
import NotificationsPageClient from "@/domain/seller/notifications/components/NotificationsPageClient";

import { requireRole } from "@/domain/auth/guard/require-role";
import { UserRole } from "@/types";
import { connection } from "next/server";

export default async function NotificationsPage() {
  await connection();

  const user = await requireRole([UserRole.SELLER]);

  const userId = user?.id;

  return <NotificationsPageClient userId={userId} />;
}
