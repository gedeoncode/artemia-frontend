"use client";

import { useState, useCallback, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils/";

import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/button/Button";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";

interface ManageSellersFiltersProps {
  searchTerm: string;
  statusFilter: string;
  isVerified?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onVerifiedChange?: (value: boolean) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "blocked", label: "Blocked" },
];

export default function ManageSellersFilters({
  searchTerm,
  statusFilter,
  isVerified,
  onSearchChange,
  onStatusChange,
  onVerifiedChange,
  isLoading = false,
}: ManageSellersFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (isVerified !== undefined && isVerified !== false) count++;
    return count;
  }, [statusFilter, isVerified]);

  const hasActiveFilters = useMemo(
    () => activeFilterCount > 0,
    [activeFilterCount],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      onSearchChange(value);
    },
    [onSearchChange],
  );

  const handleReset = useCallback(() => {
    setLocalSearch("");
    onSearchChange("");
    onStatusChange("all");
    if (onVerifiedChange) {
      onVerifiedChange(false);
    }
  }, [onSearchChange, onStatusChange, onVerifiedChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or business..."
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
        <div className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={statusFilter}
              onValueChange={onStatusChange}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {onVerifiedChange && (
            <div className="flex items-center justify-between gap-2 pt-7 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="verified">Verified Sellers</Label>
              <Switch
                id="verified"
                checked={isVerified || false}
                onCheckedChange={(checked) => onVerifiedChange(checked)}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
