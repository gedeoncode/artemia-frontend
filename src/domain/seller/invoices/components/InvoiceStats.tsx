import type { InvoiceStats } from "../../dashboard/types/invoiceTypes";

const statCards = [
  {
    id: "total",
    label: "Total Invoices",
    value: "totalInvoices",
    color: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    id: "pending",
    label: "Pending",
    value: "pending",
    color: "bg-gradient-to-r from-yellow-500 to-amber-500",
  },
  {
    id: "paid",
    label: "Paid",
    value: "paid",
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: "overdue",
    color: "bg-gradient-to-r from-red-500 to-pink-500",
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "totalRevenue",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    isCurrency: true,
  },
  {
    id: "outstanding",
    label: "Outstanding",
    value: "outstandingBalance",
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    isCurrency: true,
  },
];

export const InvoiceStatsCards = ({
  stats,
}: {
  stats: InvoiceStats | null;
}) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((card) => (
        <div
          key={card.id}
          className={`p-4 rounded-lg shadow-sm text-white ${card.color}`}
        >
          <h3 className="text-sm font-medium">{card.label}</h3>
          <p className="text-2xl font-bold">
            {card.isCurrency ? "$" : ""}
            {card.isCurrency
              ? stats[card.value as keyof InvoiceStats].toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                )
              : stats[card.value as keyof InvoiceStats]}
          </p>
        </div>
      ))}
    </div>
  );
};
