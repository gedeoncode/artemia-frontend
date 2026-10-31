// app/admin/dashboard/page.tsx
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Icons } from "@/components/Icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  ScrollArea,
} from "@/components/ui/";
import { StatCard } from "@/domain/admin/components/StatCard";

// Lazy load heavy components
const RevenueAnalyticsChart = dynamic(
  () =>
    import("@/domain/admin/components/RevenueAnalyticsChart").then((mod) => ({
      default: mod.RevenueAnalyticsChart,
    })),
  {
    // ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

import { NotificationButton } from "@/domain/admin/components/NotificationButton";
import { UserProfileDropdown } from "@/domain/admin/components/UserProfile";
import { UserSummary } from "@/types";
import { AdminDashboardResponse } from "../types/adminDashboard.types";
// Metadata
export const metadata: Metadata = {
  title: "Admin Dashboard | Revenue Analytics",
  description:
    "Comprehensive dashboard for monitoring revenue, sellers, and platform performance",
};


const ChartSkeleton = () => (
  <div className="w-full h-[400px] flex items-center justify-center">
    <div className="space-y-4 w-full">
      <Skeleton className="w-full h-[300px] rounded-xl" />
      <div className="flex justify-center gap-4">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
    </div>
  </div>
);
type AdminDashboardScreenProps = {
  user: UserSummary;
  stats: AdminDashboardResponse;
};

export function AdminDashboardScreen({user, stats}: AdminDashboardScreenProps) {


  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        {/* Header with Glassmorphism */}
        <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Icons.barChart className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent md:text-2xl">
                  Admin Dashboard
                </h1>
              </div>
              <Badge
                variant="outline"
                className="border-green-500 text-green-600"
              >
                <span className="relative flex w-2 h-2 mr-1">
                  <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></span>
                  <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
                </span>
                Live
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationButton count={stats.totals.unreadNotifications} />
              <UserProfileDropdown user={user} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-6 md:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatCard
              title="Total Sellers"
              value={stats.totals.sellers}
              icon={<Icons.store className="w-4 h-4" />}
              trend={
                stats.sellers.total > 0
                  ? (stats.sellers.pendingApplications / stats.sellers.total) *
                    100
                  : 0
              }
              trendLabel="pending approval"
              color="blue"
            />
            <StatCard
              title="Total Users"
              value={stats.totals.users}
              icon={<Icons.users className="w-4 h-4" />}
              trend={stats.users.newLast7Days}
              trendLabel="new this week"
              color="green"
            />
            <StatCard
              title="Active Products"
              value={stats.totals.products}
              icon={<Icons.shoppingBag className="w-4 h-4" />}
              warning={stats.products.lowStockCount > 0}
              warningLabel={`${stats.products.lowStockCount} low stock`}
              color="amber"
            />
            <StatCard
              title="Total Orders"
              value={stats.totals.orders}
              icon={<Icons.truck className="w-4 h-4" />}
              trend={stats.revenue.monthlyGrowth}
              trendLabel="monthly growth"
              color="purple"
            />
            <StatCard
              title="Total Revenue"
              value={stats.revenue.total}
              icon={<Icons.dollarSign className="w-4 h-4" />}
              isCurrency
              color="emerald"
            />
            <StatCard
              title="Platform Revenue"
              value={stats.revenue.platform}
              icon={<Icons.server className="w-4 h-4" />}
              isCurrency
              color="indigo"
            />
          </div>

          {/* Main Analytics Section */}
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
            {/* Revenue Chart - Spans 2 columns on desktop */}
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.chartLine className="w-5 h-5 text-blue-600" />
                      Revenue Analytics
                    </CardTitle>
                    <CardDescription>
                      Track seller and platform earnings over time with detailed
                      breakdown
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icons.informationCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Data updated monthly • Last 12 months</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                {/* Revenue Summary Cards */}
                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Seller Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        ${stats.revenue.seller.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        From product sales
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Platform Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        ${stats.revenue.platform.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        From fees & services
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        ${stats.revenue.total.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {stats.revenue.monthlyGrowth >= 0 ? (
                          <Icons.arrowTrendingUp className="w-3 h-3 text-green-600" />
                        ) : (
                          <Icons.arrowTrendingDown className="w-3 h-3 text-red-600" />
                        )}
                        <span
                          className={`text-xs font-medium ${stats.revenue.monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {stats.revenue.monthlyGrowth >= 0 ? "+" : ""}
                          {stats.revenue.monthlyGrowth.toFixed(1)}% from last
                          month
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Chart */}
                <RevenueAnalyticsChart
                  data={stats.revenue.monthlyData}
                  isLoading={false}
                  title="Monthly Revenue Breakdown"
                  description="Seller vs Platform revenue over time"
                  currencySymbol="$"
                  height={360}
                />
              </CardContent>
            </Card>

            {/* Seller Performance & Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.trophy className="w-5 h-5 text-yellow-600" />
                  Seller Rankings
                </CardTitle>
                <CardDescription>Top performers by total sales</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {stats.sellers.topPerformers.map((seller, index) => (
                      <div
                        key={seller._id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-800"
                            : index === 1
                              ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border border-gray-200 dark:border-gray-800"
                              : index === 2
                                ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800"
                                : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                    ? "bg-orange-500 text-white"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{seller.businessName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>⭐ {seller.rating.toFixed(1)}</span>
                              <span>•</span>
                              <span>
                                {seller.totalSales.toLocaleString()} sales
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${seller.totalSales.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Pending Applications Alert */}
                {stats.sellers.pendingApplications > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icons.clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">
                          Pending Applications
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-amber-600"
                      >
                        {stats.sellers.pendingApplications}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.sellers.pendingApplications} seller
                      {stats.sellers.pendingApplications > 1 ? "s" : ""} waiting
                      for approval
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section with Tabs */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icons.fire className="w-5 h-5 text-orange-600" />
                    Top Selling Products
                  </CardTitle>
                  <Link
                    href="/admin/products"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {stats.products.topSelling.map((product, index) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                            {product.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icons.shoppingBag className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>${product.price.toLocaleString()}</span>
                              <span>•</span>
                              <span>{product.salesCount} sold</span>
                              {product.stock < 10 && (
                                <>
                                  <span>•</span>
                                  <Badge variant="danger" className="text-xs">
                                    Low Stock
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            $
                            {(
                              product.price * product.salesCount
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            revenue
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recent Orders & Notifications Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.activity className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                    <TabsTrigger value="notifications">
                      Notifications
                      {stats.notifications.unreadCount > 0 && (
                        <Badge variant="danger" className="ml-2">
                          {stats.notifications.unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="orders" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {stats.recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{order.user}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{order.items} items</span>
                                <span>•</span>
                                <span>
                                  {new Date(order.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ${order.amount.toLocaleString()}
                              </p>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "pending"
                                      ? "secondary"
                                      : "danger"
                                }
                                className="text-xs"
                              >
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {stats.notifications.recent.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg border transition-colors ${
                              !notification.read
                                ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {notification.type === "success" && (
                                <Icons.checkCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              )}
                              {notification.type === "warning" && (
                                <Icons.warning className="w-4 h-4 text-yellow-600 mt-0.5" />
                              )}
                              {notification.type === "error" && (
                                <Icons.xCircle className="w-4 h-4 text-red-600 mt-0.5" />
                              )}
                              {notification.type === "info" && (
                                <Icons.info className="w-4 h-4 text-blue-600 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <span>{notification.sender}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(
                                      notification.date,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* System Health Footer (Optional) */}
          {process.env.NODE_ENV === "development" && stats.systemHealth && (
            <div className="mt-6 p-4 rounded-lg bg-muted/30 border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>🖥️ Node: {stats.systemHealth.nodeVersion}</span>
                  <span>🌍 Env: {stats.systemHealth.environment}</span>
                  <span>
                    ⏱️ Uptime: {Math.floor(stats.systemHealth.uptime / 3600)}h
                  </span>
                </div>
                <div>
                  💾 Memory:{" "}
                  {(
                    stats.systemHealth.memoryUsage.heapUsed /
                    1024 /
                    1024
                  ).toFixed(0)}
                  MB /{" "}
                  {(
                    stats.systemHealth.memoryUsage.heapTotal /
                    1024 /
                    1024
                  ).toFixed(0)}
                  MB
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}
