import type { InvoiceStatus } from "../../../dashboard/types/invoiceTypes";

const statusClasses = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export const InvoiceStatusBadge = ({ status }: { status: InvoiceStatus }) => (
  <span
    className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusClasses[status]}`}
  >
    {statusLabels[status]}
  </span>
);
