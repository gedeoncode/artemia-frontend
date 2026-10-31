import {
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";
import { StatsCard } from "./StatsCards";
import { Badge } from "@/components/ui/Badge"; // ✅ import your new Badge

type StatsGridProps = {
  stats: {
    totalSales: number;
    totalProducts: number;
    pendingOrders: number;
    paymentStatus: boolean;
  } | null;
};

export const StatsGrid = ({ stats }: StatsGridProps) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        icon={
          <Badge variant="danger" size="md" rounded="full" className="py-2.5">
            <FiDollarSign className="w-5 h-5" />
          </Badge>
        }
        title="Total Sales"
        value={stats.totalSales || 0}
        isCurrency
        colorVariant="danger"
      />

      <StatsCard
        icon={
          <Badge variant="primary" size="md" rounded="full" className="py-2.5">
            <FiPackage className="w-5 h-5" />
          </Badge>
        }
        title="Products Listed"
        value={stats.totalProducts ?? 0}
        colorVariant="primary"
      />

      <StatsCard
        icon={
          <Badge variant="warning" size="md" rounded="full" className="py-2.5">
            <FiShoppingCart className="w-5 h-5" />
          </Badge>
        }
        title="Pending Orders"
        value={stats.pendingOrders || 0}
        colorVariant="warning"
      />
    </div>
  );
};
