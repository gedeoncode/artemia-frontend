"use client";

import { memo } from "react";
import { RefreshCw, Download, Calendar } from "lucide-react";
import { useDashboardExport } from "../../hooks/";
import type {
  DashboardFilters,
  ChartInterval,
  DashboardResponse,
} from "../../types/dashboard.types";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Separator,
} from "@/components/ui/";

type DashboardHeaderProps = {
  data: DashboardResponse;
  filters: DashboardFilters;
  isFetching: boolean;
  onFilterChange: (filters: Partial<DashboardFilters>) => void;
  onIntervalChange: (interval: ChartInterval) => void;
  onRefresh: () => void;
};

export const DashboardHeader = memo(function DashboardHeader({
  data,
  filters,
  isFetching,
  onFilterChange,
  onIntervalChange,
  onRefresh,
}: DashboardHeaderProps) {
  const { exportData, isExporting } = useDashboardExport();
  const seller = data?.seller;
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-20 bg-background/98 backdrop-blur-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Row 1: Title + Actions - 48px height */}
          <div className="flex items-center justify-between h-12">
            {/* Title area - compressed horizontal layout */}
            <div className="flex items-baseline gap-2 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Welcome back,{" "}
                <span className="text-foreground font-medium">
                  {seller?.user?.name?.split(" ")[0] || seller?.businessName}
                </span>
              </p>
            </div>

            {/* Actions - compact, always visible */}
            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isFetching}
                    className="h-8 px-2.5"
                    aria-label="Refresh data"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 transition-transform ${
                        isFetching ? "animate-spin" : ""
                      }`}
                    />
                    <span className="ml-1.5 text-sm hidden sm:inline">
                      Refresh
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Refresh dashboard data</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportData(data)}
                    disabled={isExporting}
                    className="h-8 px-2.5"
                    aria-label="Export dashboard data"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="ml-1.5 text-sm hidden sm:inline">
                      {isExporting ? "Exporting..." : "Export"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Export data as CSV</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Row 2: Filters Toolbar - 40px height */}
          <div className="flex flex-wrap items-center gap-2 py-2 border-t">
            {/* Date selectors group */}
            <div className="flex items-center gap-1 bg-muted/30 rounded-md p-0.5">
              <Select
                value={filters.month.toString()}
                onValueChange={(value) =>
                  onFilterChange({ month: parseInt(value) })
                }
              >
                <SelectTrigger className="w-[130px] h-8 border-0 bg-transparent hover:bg-muted/50 focus:ring-0 gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(2000, month - 1, 1).toLocaleString("default", {
                        month: "short",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-5" />

              <Select
                value={filters.year.toString()}
                onValueChange={(value) =>
                  onFilterChange({ year: parseInt(value) })
                }
              >
                <SelectTrigger className="w-[85px] h-8 border-0 bg-transparent hover:bg-muted/50 focus:ring-0 text-sm">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Granularity toggle - connected visually */}
            <div className="flex items-center">
              <ToggleGroup
                type="single"
                value={filters.interval}
                onValueChange={(value) =>
                  value && onIntervalChange(value as ChartInterval)
                }
                className="gap-0.5 bg-muted/30 rounded-md p-0.5"
              >
                <ToggleGroupItem
                  value="daily"
                  aria-label="Daily view"
                  className="h-8 px-3 text-xs font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm rounded"
                >
                  Daily
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="weekly"
                  aria-label="Weekly view"
                  className="h-8 px-3 text-xs font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm rounded"
                >
                  Weekly
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="monthly"
                  aria-label="Monthly view"
                  className="h-8 px-3 text-xs font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm rounded"
                >
                  Monthly
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
});