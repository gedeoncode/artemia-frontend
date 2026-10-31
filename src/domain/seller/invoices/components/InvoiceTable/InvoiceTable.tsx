import { InvoiceRow } from "./InvoiceRow";
import type { Invoice } from "../../../dashboard/types/invoiceTypes";

type InvoiceTableProps = {
  invoices: Invoice[];
  onViewDetails: (invoiceId: string) => void;
  sortConfig: {
    sort?: string;
    order?: string;
  };
  onSort: (field: string) => void;
};

export const InvoiceTable = ({
  invoices,
  onViewDetails,
  sortConfig,
  onSort,
}: InvoiceTableProps) => {
  const getSortIcon = (field: string) => {
    if (sortConfig.sort !== field) return null;
    return sortConfig.order === "asc" ? "↑" : "↓";
  };

  return (
    <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
              onClick={() => onSort("issueDate")}
            >
              Invoice {getSortIcon("issueDate")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
              onClick={() => onSort("dueDate")}
            >
              Dates {getSortIcon("dueDate")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase cursor-pointer"
              onClick={() => onSort("totalAmount")}
            >
              Amount {getSortIcon("totalAmount")}
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
