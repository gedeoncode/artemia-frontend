import { useMemo } from "react";
import {
  Category,
  DashboardStats,
  SellerInfo,
} from "../../types/dashboard.types";
import { StatsGrid } from "../StatsCard/StatsGrid";
import { NotificationsSection } from "../NotificationsSection/NotificationsSection";
// import { CategorySection } from "../CategorySection";
import { QuickActions } from "../QuickActions";
import { NotificationIcon } from "../NotificationsSection/NotificationIcon";
import { Notification } from "../../types/notificationTypes";
export function ActivatedView({
  sellerInfo,
  notifications,
  dashboardStats,
  // categories,
  navigateTo,
}: {
  sellerInfo: SellerInfo;
  notifications: Notification[];
  dashboardStats: DashboardStats;
  categories: Category[];
  navigateTo: (path: string) => void;
}) {
  const unreadCount = useMemo(
    () => dashboardStats.unreadCount,
    [dashboardStats],
  );
  const sellerId = sellerInfo.id;
  return (
    <div className="flex-1 p-4 overflow-auto md:p-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 md:text-3xl">
            Bienvenue,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {sellerInfo?.user?.name}
            </span>{" "}
            👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Voici un aperçu de vos ventes et de vos performances du jour.
          </p>
        </div>
        <button
          aria-label={`Notifications (${unreadCount} non lues)`}
          className="relative hidden md:block p-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => navigateTo("/seller/dashboard/notifications")}
        >
          <NotificationIcon unreadCount={unreadCount} />
        </button>
      </div>

      {/* Stats cards */}
      <StatsGrid stats={dashboardStats} />

      {/* Notifications */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        <QuickActions navigateTo={navigateTo} />
        <NotificationsSection
          notifications={notifications}
          navigateTo={navigateTo}
          userId={sellerId}
        />
      </div>

      {/* Categories & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {/* <CategorySection
          category={dashboardStats?.category}
          categories={categories}
          navigateTo={navigateTo}
        /> */}
      </div>
    </div>
  );
}
