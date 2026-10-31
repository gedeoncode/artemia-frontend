"use client";

import { useCallback, useTransition } from "react";

import { useManageLeads } from "../hooks/useManageLeads";

import { LeadFilters } from "./LeadFilters";
import { LeadTable } from "./LeadTable/LeadTable";
// import { LeadTableSkeleton } from "./ui/LeadTableSkeleton";

import { Pagination } from "@/components/Pagination";

import type {
  GetSellerLeadsResponse,
  LeadFilterParams,
} from "../types/seller.lead.types";

interface ManageLeadsScreenProps {
  initialData: GetSellerLeadsResponse;
  initialFilterParams: LeadFilterParams;
}

export function ManageLeadsScreen({
  initialData,
  initialFilterParams,
}: ManageLeadsScreenProps) {
  const [isPending, startTransition] = useTransition();

  const {
    leads,
    pagination,
    filterParams,
    setFilterParams,
    isLoading,
    handleViewLead,
    handleUpdateStatus,
    updateError,
    error,
  } = useManageLeads({
    initialData,
    initialFilterParams,
  });

  const handlePageChange = useCallback(
    (page: number) => {
      startTransition(() => {
        setFilterParams((prev) => ({
          ...prev,
          page,
        }));
      });
    },
    [setFilterParams],
  );



  return (
      <div className="px-4 py-4 space-y-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-semibold">Lead Management</h1>

          <p className="text-sm text-muted-foreground">
            Monitor inquiries and track customer conversions.
          </p>
        </header>

        {/* FILTERS */}
        <LeadFilters
          params={filterParams}
          onParamsChange={setFilterParams}
        />

        {/* TABLE */}
        
          <LeadTable
            leads={leads}
            isLoading={isPending || isLoading}
            onViewLead={handleViewLead}
            onUpdateStatus={handleUpdateStatus}
            updateError={updateError}
          />

        {/* PAGINATION */}
        {pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
  );
}
