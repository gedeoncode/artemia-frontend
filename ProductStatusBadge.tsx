import { ProductDisplayStatus } from "./src/domain/seller/products/types/filter.types";

const statusColors: Record<ProductDisplayStatus, string> = {
  active: "bg-green-100 text-green-800",

  draft: "bg-gray-100 text-gray-800",

  pending_review: "bg-amber-100 text-amber-800",

  rejected: "bg-red-100 text-red-800",

  suspended: "bg-red-100 text-red-800",

  archived: "bg-slate-100 text-slate-700",

  out_of_stock: "bg-orange-100 text-orange-800",

  payment_required: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<ProductDisplayStatus, string> = {
  active: "Active",

  draft: "Draft",

  pending_review: "Pending Review",

  rejected: "Rejected",

  suspended: "Suspended",

  archived: "Archived",

  out_of_stock: "Out of Stock",

  payment_required: "Payment Required",
};

type ProductStatusBadgeProps = {
  status: ProductDisplayStatus;
};

export const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        statusColors[status]
      }`}
    >
      {statusLabels[status]}
    </span>
  );
};
