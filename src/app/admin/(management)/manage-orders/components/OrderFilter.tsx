"use client";

import {
  ORDER_STATUS_OPTIONS,
  HANDLED_BY_OPTIONS,
} from "../../../../../domain/admin/constants/constants";

interface OrderFiltersProps {
  searchValue: string;
  statusValue: string;
  handledByValue: string;
  startDateValue: string;
  endDateValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onDateChange: (type: "start" | "end", value: string) => void;
}

export function OrderFilters({
  searchValue,
  statusValue,
  handledByValue,
  startDateValue,
  endDateValue,
  onSearchChange,
  onFilterChange,
  onDateChange,
}: OrderFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Search Input */}
      <div>
        <label
          htmlFor="search"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Search Orders
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search by order ID or customer..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div>
        <label
          htmlFor="status"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Order Status
        </label>
        <select
          id="status"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={statusValue}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Handled By Filter */}
      <div>
        <label
          htmlFor="handledBy"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Handled By
        </label>
        <select
          id="handledBy"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={handledByValue}
          onChange={(e) => onFilterChange("handledBy", e.target.value)}
        >
          {HANDLED_BY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="startDate"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            From Date
          </label>
          <input
            type="date"
            id="startDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={startDateValue}
            onChange={(e) => onDateChange("start", e.target.value)}
            max={endDateValue}
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            To Date
          </label>
          <input
            type="date"
            id="endDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={endDateValue}
            onChange={(e) => onDateChange("end", e.target.value)}
            min={startDateValue}
          />
        </div>
      </div>
    </div>
  );
}
