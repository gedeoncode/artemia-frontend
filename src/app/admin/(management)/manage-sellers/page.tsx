"use client";

import { useState } from "react";

import { Seller } from "./services/types";

import SellerDocumentDrawer from "./components/SellerDocumentsDrawer";

import { TooltipProvider } from "@/components/ui/Tooltip";

import ManageSellersFilters from "./components/ManageSellersFilters";

import ManageSellersTable from "./components/ManageSellersTable";

import { Pagination } from "@/components/Pagination";

import { useManageSellers } from "./hooks/useManageSellers";
import { SellerTableSkeleton } from "./components/SellerTableSkeleton";

export default function ManageSellersPage() {
  const {
    // Query
    sellers,

    isLoading,
    isFetching,

    // Filters
    searchTerm,
    statusFilter,

    handleSearchChange,
    handleStatusFilterChange,

    // Pagination
    currentPage,
    totalPages,
    totalSellers,

    setCurrentPage,

    // Actions
    approveSeller,
    rejectSeller,

    blockSeller,
    unblockSeller,

    // Mutation Helpers
    isUpdatingSeller,
    isBlockingSeller,

    // Refetch
    refetch,
  } = useManageSellers();

  const [docDrawerOpen, setDocDrawerOpen] =
    useState(false);

  const [selectedSeller, setSelectedSeller] =
    useState<Seller | null>(null);

  // =========================================
  // Handlers
  // =========================================
  const handleViewDocuments = (
    seller: Seller
  ) => {
    setSelectedSeller(seller);

    setDocDrawerOpen(true);
  };
  // =========================
  // Render helpers
  // =========================
  const renderSkeleton = () => <SellerTableSkeleton />;
  return (
    <TooltipProvider>
      <div className="p-6 space-y-4">
        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-blue-900">
              Manage Sellers
            </h1>

            {isFetching && !isLoading && (
              <p className="text-sm text-muted-foreground">
                Refreshing sellers...
              </p>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* Filters */}
        {/* ========================================= */}
        <ManageSellersFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={
            handleSearchChange
          }
          onStatusChange={
            handleStatusFilterChange
          }
        />

        {/* ========================================= */}
          <div className="space-y-4">
            {/* ========================================= */}
            {/* Table */}
            {/* ========================================= */}
            <ManageSellersTable
              sellers={sellers}
              onViewDocuments={
                handleViewDocuments
              }
              onApprove={approveSeller}
              onReject={rejectSeller}
              onBlock={blockSeller}
              onUnblock={unblockSeller}
              isUpdatingSeller={
                isUpdatingSeller
              }
              isBlockingSeller={
                isBlockingSeller
              }
              isFetching={isLoading || isFetching}
              renderSkeleton = {renderSkeleton}
            />

            {/* ========================================= */}
            {/* Footer */}
            {/* ========================================= */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                {sellers.length} of{" "}
                {totalSellers} sellers
              </p>

              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={totalPages}
                onPageChange={
                  setCurrentPage
                }
              />
            </div>
          </div>
        

        {/* ========================================= */}
        {/* Document Drawer */}
        {/* ========================================= */}
        <SellerDocumentDrawer
          open={docDrawerOpen}
          onClose={() =>
            setDocDrawerOpen(false)
          }
          seller={selectedSeller}
          onStatusChange={refetch}
        />
      </div>
    </TooltipProvider>
  );
}