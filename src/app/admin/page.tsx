import { getCurrentUser } from "@/domain/auth/services";
import { fetchAdminDashboard } from "@/domain/admin/services/adminStat.services";
import { AdminDashboardScreen } from "@/domain/admin/components/DashboardScreen";

export default async function Page(){
  const {user } = await getCurrentUser() 
  const stats  = await fetchAdminDashboard() 
  return <AdminDashboardScreen user={user} stats={stats} />

}