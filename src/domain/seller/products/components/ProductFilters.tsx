// @/domain/manage-products/components/ProductFilters.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ProductFilterParams,
  SortField,
  PRODUCT_DISPLAY_STATUSES,
  PRODUCT_DISPLAY_STATUS_LABELS,
} from "../types/filter.types";

// shadcn/ui components
import { Input } from "@/components/ui/";
import { Button } from "@/components/ui/";
import { Badge } from "@/components/ui/";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/";

interface ProductFiltersProps {
  params: ProductFilterParams;
  onParamsChange: (params: ProductFilterParams) => void;
  isLoading?: boolean;
}

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "name", label: "Product Name" },
  { value: "price", label: "Price" },
  { value: "sales_count", label: "Best Selling" },
] as const;

const getStatusLabel = (status: string): string => {
  return (
    PRODUCT_DISPLAY_STATUS_LABELS[
      status as keyof typeof PRODUCT_DISPLAY_STATUS_LABELS
    ] || status
  );
};

const getSortLabel = (sort?: string): string => {
  return (
    SORT_OPTIONS.find((option) => option.value === sort)?.label ||
    "Date Created"
  );
};

export function ProductFilters({
  params,
  onParamsChange,
  isLoading = false,
}: ProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const debouncedSearch = useDebounce(searchInput, 300);
  const isFilterLoading = isLoading;

  // Handle search debounce
  useEffect(() => {
    const nextSearch = debouncedSearch || undefined;

    if (nextSearch === params.search) return;

    onParamsChange({
      ...params,
      search: nextSearch,
      page: 1,
    });
  }, [debouncedSearch, params.search]);

  const updateFilter = <K extends keyof ProductFilterParams>(
    key: K,
    value: ProductFilterParams[K],
  ) => {
    onParamsChange({
      ...params,
      [key]: value,
      page: 1,
    });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    onParamsChange({
      page: 1,
      limit: params.limit,
      sort: "createdAt",
      order: "desc",
    });
  };

  const removeFilter = (filter: keyof ProductFilterParams, value?: string) => {
    if (filter === "status" && value === "all") {
      updateFilter("status", undefined);
    } else if (filter === "search") {
      setSearchInput("");
      updateFilter("search", undefined);
    } else if (filter === "sort") {
      updateFilter("sort", "createdAt");
      updateFilter("order", "desc");
    } else {
      updateFilter(filter, undefined);
    }
  };

  // Count active filters (excluding defaults)
  const activeFiltersCount = [
    params.search,
    params.status && params.status !== "all",
    params.sort !== "createdAt",
    params.order !== "desc",
  ].filter(Boolean).length;

  // Active filters for display
  const activeFilters = [
    params.search && {
      key: "search",
      label: `Search: ${params.search}`,
      onRemove: () => removeFilter("search"),
    },
    params.status &&
      params.status !== "all" && {
        key: "status",
        label: `Status: ${getStatusLabel(params.status)}`,
        onRemove: () => removeFilter("status"),
      },
    (params.sort !== "createdAt" || params.order !== "desc") && {
      key: "sort",
      label: `Sort: ${getSortLabel(params.sort)} (${params.order === "asc" ? "Ascending" : "Descending"})`,
      onRemove: () => removeFilter("sort"),
    },
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    onRemove: () => void;
  }>;

  return (
    <div className="space-y-3">
      {/* Main filter bar - responsive grid */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        {/* Search input - grows on larger screens */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
            disabled={isFilterLoading}
            aria-label="Search products"
          />
        </div>

        {/* Filter controls - horizontal scroll on mobile, row on desktop */}
        <div className="flex gap-2 shrink-0">
          {/* Status filter popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="md"
                className="gap-2"
                disabled={isFilterLoading}
                aria-label="Filter by status"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                {params.status && params.status !== "all" && (
                  <Badge variant="secondary" className="ml-0 sm:ml-1 px-1.5">
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-sm font-medium">Status</div>
                {PRODUCT_DISPLAY_STATUSES.map((status) => (
                  <Button
                    key={status}
                    variant={params.status === status ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => {
                      updateFilter(
                        "status",
                        params.status === status ? undefined : status,
                      );
                    }}
                    disabled={isFilterLoading}
                  >
                    {getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort select */}
          <Select
            value={`${params.sort}|${params.order}`}
            onValueChange={(value) => {
              const [sort, order] = value.split("|");
              updateFilter("sort", sort as SortField);
              updateFilter("order", order as "asc" | "desc");
            }}
            disabled={isFilterLoading}
          >
            <SelectTrigger className="w-[130px] sm:w-[160px] gap-2">
              <ArrowUpDown className="h-4 w-4 shrink-0" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <div key={option.value}>
                  <SelectItem value={`${option.value}|desc`}>
                    {option.label} (Newest first)
                  </SelectItem>
                  <SelectItem value={`${option.value}|asc`}>
                    {option.label} (Oldest first)
                  </SelectItem>
                </div>
              ))}
            </SelectContent>
          </Select>

          {/* Clear all button - only show when filters active */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="default"
              onClick={clearAllFilters}
              disabled={isFilterLoading}
              className="gap-1"
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active filters chips */}
      {activeFilters.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label="Active filters"
        >
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="gap-1.5 px-2.5 py-1 text-sm font-normal"
              role="listitem"
            >
              {filter.label}
              <button
                onClick={filter.onRemove}
                disabled={isFilterLoading}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
