import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";
import type { InvoiceFilterParams } from "../../dashboard/types/invoiceTypes";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled", label: "Cancelled" },
];

export const InvoiceFilters = ({
  params,
  onParamsChange,
}: {
  params: InvoiceFilterParams;
  onParamsChange: (params: InvoiceFilterParams) => void;
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange({ ...params, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onParamsChange({
      ...params,
      status: (e.target.value || undefined) as InvoiceFilterParams["status"],
    });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange({ ...params, dateFrom: e.target.value || undefined });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange({ ...params, dateTo: e.target.value || undefined });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort, order] = e.target.value.split("_");
    onParamsChange({
      ...params,
      sort: sort as InvoiceFilterParams["sort"],
      order: order as InvoiceFilterParams["order"],
    });
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={params.search || ""}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={params.status || ""}
              onChange={handleStatusChange}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={params.dateFrom || ""}
              onChange={handleDateFromChange}
              max={params.dateTo || undefined}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={params.dateTo || ""}
              onChange={handleDateToChange}
              min={params.dateFrom || undefined}
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={`${params.sort || "issueDate"}_${params.order || "desc"}`}
            onChange={handleSortChange}
          >
            <option value="issueDate_desc">Newest First</option>
            <option value="issueDate_asc">Oldest First</option>
            <option value="dueDate_asc">Due Soonest</option>
            <option value="dueDate_desc">Due Latest</option>
            <option value="totalAmount_desc">Amount (High-Low)</option>
            <option value="totalAmount_asc">Amount (Low-High)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
