"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderFilters } from "./components/OrderFilter";
import { OrdersTable } from "./components/OrdersTable";
import { Pagination } from "@/components/Pagination";
import { OrdersTableSkeleton } from "./components/TableSkeleton";
import { PageHeader } from "../../../../domain/admin/components/pageHeader";
import { Order } from "./services/types";
import { OrderDetailsDrawer } from "./components/OrderDetailsDrawer";
import { DEFAULT_PAGE_SIZE } from "../../../../domain/admin/constants/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { format, subDays } from "date-fns";

export default function AdminOrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [handledByFilter, setHandledByFilter] = useState("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const limit = DEFAULT_PAGE_SIZE;

  // Set default date range (last 30 days)
  useEffect(() => {
    const defaultEndDate = format(new Date(), "yyyy-MM-dd");
    const defaultStartDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!startDate || !endDate) return; // Don't fetch until dates are set

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(handledByFilter !== "all" && { handledBy: handledByFilter }),
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        startDate,
        endDate,
      });

      const response = await fetch(
        `/api/admin/orders?${queryParams.toString()}`,
        {
          next: { revalidate: 60 },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();
      setOrders(data.orders);
      setTotalItems(data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again later.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    statusFilter,
    handledByFilter,
    debouncedSearchQuery,
    limit,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "handledBy") {
      setHandledByFilter(value);
    }
    setCurrentPage(1);
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="p-4 space-y-6">
      <PageHeader title="Manage Orders" />

      <OrderFilters
        searchValue={searchQuery}
        statusValue={statusFilter}
        handledByValue={handledByFilter}
        startDateValue={startDate}
        endDateValue={endDate}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onDateChange={handleDateChange}
      />

      {error ? (
        <div className="p-4 text-red-600 rounded bg-red-50">{error}</div>
      ) : isLoading ? (
        <OrdersTableSkeleton />
      ) : (
        <>
          <OrdersTable orders={orders} isLoading={false} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <OrderDetailsDrawer />
    </div>
  );
}
