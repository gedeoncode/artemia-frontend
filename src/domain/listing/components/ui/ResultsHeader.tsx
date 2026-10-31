"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button/Button";

type Props = {
  page: number;
  limit: number;
  total: number;
  query?: string;
  onOpenFilters?: () => void;
};

export function ResultsHeader({
  page,
  limit,
  total,
  query,
  onOpenFilters,
}: Props) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="w-full padding-container py-2 mb-4 border rounded-sm bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 text-sm">
        {/* Left: Results text */}
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">
            {total === 0 ? 0 : start}–{end}
          </span>{" "}
          of <span className="font-medium text-foreground">{total}</span>{" "}
          results
          {query && (
            <>
              {" "}
              for <span className="font-medium text-foreground">"{query}"</span>
            </>
          )}
        </p>

        {/* Right: Mobile filters */}
        {onOpenFilters && (
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={onOpenFilters}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
