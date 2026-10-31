"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button/Button";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils/";
import { TypeCategoryFilters } from "../services/types";

interface CategoryFiltersProps {
  filters: TypeCategoryFilters;
  onFilterChange: (newFilters: Partial<TypeCategoryFilters>) => void;
  isLoading?: boolean;
}

export default function CategoryFilters({
  filters,
  onFilterChange,
  isLoading = false,
}: CategoryFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 500);
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) =>
        filters[key as keyof TypeCategoryFilters] !== undefined &&
        key !== "page" &&
        key !== "sortBy",
    ).length;
  }, [filters]);

  const hasActiveFilters = useMemo(
    () => activeFilterCount > 0,
    [activeFilterCount],
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<TypeCategoryFilters>) => {
      onFilterChange(newFilters);
    },
    [onFilterChange],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (!value) {
        handleFilterChange({ search: "" });
      }
    },
    [handleFilterChange],
  );

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      handleFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, handleFilterChange]);

  const handleReset = useCallback(() => {
    setLocalSearch("");
    handleFilterChange({
      search: "",
      status: undefined,
      type: undefined,
      isFeatured: undefined,
      parent: undefined,
      level: undefined,
    });
  }, [handleFilterChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="w-full pl-9"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
            disabled={isLoading}
            aria-expanded={isExpanded}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4 overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100 visible"
            : "grid-rows-[0fr] opacity-0 invisible",
        )}
        aria-hidden={!isExpanded}
      >
        <div className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                handleFilterChange({
                  status: value as "active" | "archived" | undefined,
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) =>
                handleFilterChange({
                  type: value as "main" | "sub" | undefined,
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="sub">Subcategory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={filters.level ? String(filters.level) : undefined}
              onValueChange={(value) =>
                handleFilterChange({
                  level: value ? parseInt(value) : undefined,
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="Any level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-7">
            <Label htmlFor="isFeatured">Featured</Label>
            <Switch
              id="isFeatured"
              checked={filters.isFeatured || false}
              onCheckedChange={(checked) =>
                handleFilterChange({ isFeatured: checked || undefined })
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
