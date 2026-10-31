"use client";

import { useMemo, useState, useCallback } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

import type { LeadFilterParams } from "../types/seller.lead.types";
import type { LeadStatus, ContactMethod } from "@/types/lead.types";

import { Button } from "@/components/ui/";

type LeadFiltersProps = {
  params: LeadFilterParams;
  onParamsChange: (params: LeadFilterParams) => void;
};

const defaultParams: LeadFilterParams = {
  search: "",
  status: undefined,
  contactMethod: undefined,
  page: 1,
  limit: 10,
};

export const LeadFilters = ({
  params,
  onParamsChange,
}: LeadFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onParamsChange({
        ...params,
        search: e.target.value,
        page: 1,
      });
    },
    [params, onParamsChange],
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onParamsChange({
        ...params,
        status: (e.target.value || undefined) as LeadStatus,
        page: 1,
      });
    },
    [params, onParamsChange],
  );

  const handleContactMethodChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onParamsChange({
        ...params,
        contactMethod: (e.target.value ||
          undefined) as ContactMethod,
        page: 1,
      });
    },
    [params, onParamsChange],
  );

  const handleClearFilters = useCallback(() => {
    onParamsChange(defaultParams);
  }, [onParamsChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      (params.search && params.search.trim() !== "") ||
      params.status ||
      params.contactMethod
    );
  }, [params]);

  return (
    <div className="p-4 mb-4 bg-white border border-gray-100 rounded-lg shadow-xs">
      {/* TOP BAR */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* SEARCH */}
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute w-4 h-4 text-gray-400 left-3 top-3" />

          <input
            type="text"
            placeholder="Search leads..."
            className="w-full py-2 pr-4 text-sm border border-gray-200 rounded-md pl-9 focus:ring-2 focus:ring-blue-500"
            value={params.search || ""}
            onChange={handleSearchChange}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((p) => !p)}
            className="flex items-center gap-2"
          >
            <FiFilter className="w-4 h-4" />
            {showFilters ? "Hide filters" : "Show filters"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-2 ${
              hasActiveFilters
                ? "text-red-500 hover:text-red-600"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <FiX className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 md:flex md:flex-wrap md:gap-3">

          {/* STATUS FILTER */}
          <select
            className="px-3 py-2 text-sm border border-gray-200 rounded-md"
            value={params.status || ""}
            onChange={handleStatusChange}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>

          {/* CONTACT METHOD */}
          <select
            className="px-3 py-2 text-sm border border-gray-200 rounded-md"
            value={params.contactMethod || ""}
            onChange={handleContactMethodChange}
          >
            <option value="">All contact methods</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      )}
    </div>
  );
};