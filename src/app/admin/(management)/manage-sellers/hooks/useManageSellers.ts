"use client";

import {  useState } from "react";

import {
  SellerStatus,
  PaginationMeta,
} from "../types/seller-query.types";

import { useSellersQuery } from "./useSellersQuery";

import { useSellerStatusMutation } from "./useSellerStatusMutation";

import { useSellerBlockMutation } from "./useSellerBlockMutation";

const ITEMS_PER_PAGE = 10;

const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: ITEMS_PER_PAGE,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export function useManageSellers() {
  // =========================================
  // Filters
  // =========================================
  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<SellerStatus>("all");

  // =========================================
  // Pagination
  // =========================================
  const [currentPage, setCurrentPage] =
    useState(1);

  // =========================================
  // Query
  // =========================================
  const sellersQuery = useSellersQuery({
    page: currentPage,
    searchTerm,
    statusFilter,
  });

  // =========================================
  // Mutations
  // =========================================
  const statusMutation =
    useSellerStatusMutation();

  const blockMutation =
    useSellerBlockMutation();

  // =========================================
  // Derived Data
  // =========================================
  const sellers =
    sellersQuery.data?.sellers || [];

  const pagination =
    sellersQuery.data?.pagination ||
    DEFAULT_PAGINATION;
  // =========================================
  // Filters Handlers
  // =========================================
  const handleSearchChange = (
    value: string
  ) => {
    setSearchTerm(value);

    // Reset pagination
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    value: SellerStatus
  ) => {
    setStatusFilter(value);

    // Reset pagination
    setCurrentPage(1);
  };

  // =========================================
  // Helpers
  // =========================================
  const isUpdatingSeller = (
    sellerId: string
  ) => {
    return (
      statusMutation.isPending &&
      statusMutation.variables
        ?.sellerId === sellerId
    );
  };

  const isBlockingSeller = (
    sellerId: string
  ) => {
    return (
      blockMutation.isPending &&
      blockMutation.variables
        ?.sellerId === sellerId
    );
  };

  // =========================================
  // Actions
  // =========================================
  const approveSeller = (
    sellerId: string
  ) => {
    statusMutation.mutate({
      sellerId,
      status: "approved",
    });
  };

  const rejectSeller = (
    sellerId: string
  ) => {
    statusMutation.mutate({
      sellerId,
      status: "rejected",
    });
  };

  const blockSeller = (
    sellerId: string
  ) => {
    blockMutation.mutate({
      sellerId,
      action: "block",
    });
  };

  const unblockSeller = (
    sellerId: string
  ) => {
    blockMutation.mutate({
      sellerId,
      action: "unblock",
    });
  };

  // =========================================
  // Return
  // =========================================
  return {
    // Data
    sellers,

    // Query State
    isLoading:
      sellersQuery.isLoading,

    isFetching:
      sellersQuery.isFetching,

    isError:
      sellersQuery.isError,

    error: sellersQuery.error,

    // Filters
    searchTerm,
    statusFilter,

    handleSearchChange,
    handleStatusFilterChange,

    // Pagination
    currentPage,

    setCurrentPage,

    totalPages:
      pagination.totalPages,

    totalSellers:
      pagination.total,


    // Mutations
    approveSeller,
    rejectSeller,

    blockSeller,
    unblockSeller,

    // Mutation Helpers
    isUpdatingSeller,
    isBlockingSeller,

    // Raw Mutations (optional)
    statusMutation,
    blockMutation,

    // Manual Refetch
    refetch:
      sellersQuery.refetch,
  };
}