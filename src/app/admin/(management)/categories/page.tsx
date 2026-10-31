// app/admin/categories/page.tsx
"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button/Button";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { Pagination } from "@/components/Pagination";

import { CategoryTable } from "@/domain/admin/categories/components/CategoryTable";
import CategoryFilters from "@/domain/admin/categories/components/CategoryFilters";

import { TypeCategoryFilters } from "@/domain/admin/categories/services/types";
import { useCategories } from "@/domain/admin/categories/hook";
import { CategoryTableSkeleton } from "@/domain/admin/categories/components/CategoryTableSkeleton";

export default function CategoriesPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<TypeCategoryFilters>({
    page: 1,
    sortBy: "name",
  });

  const {
    data: categoriesData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useCategories({ filters });
  const handleFilterChange = useCallback(
    (newFilters: Partial<TypeCategoryFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: 1,
      }));
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  if (error) {
    toast.error(
      `Failed to load categories, ${
        error.response?.data?.message || error.message
      }`,
    );
  }
  // =========================
  // Render helpers
  // =========================
  const renderSkeleton = () => <CategoryTableSkeleton />;
  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Category Management
            </h1>

            <p className="text-muted-foreground">
              Organize products with categories and subcategories
            </p>
          </div>

          <Button onClick={() => router.push("/admin/categories/create")}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <CategoryFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-destructive">Failed to load categories</p>

            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <CategoryTable
              categories={categoriesData?.data || []}
              onRefresh={refetch}
              isLoading={isLoading || isFetching}
              renderSkeleton={renderSkeleton}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {categoriesData?.data?.length || 0} of{" "}
                {categoriesData?.meta?.total || 0} categories
              </p>

              <Pagination
                currentPage={filters.page || 1}
                totalPages={categoriesData?.meta?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
