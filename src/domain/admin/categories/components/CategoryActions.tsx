"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

import { Icons } from "@/components/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import { EditCategoryModal } from "./_dialogs/EditCategoryDialog";
import { DeleteCategoryDialog } from "./_dialogs/DeleteCategoryDialog";
import { DeactivateCategoryDialog } from "./_dialogs/DeactiveCategoryDialog";
import { deleteCategory } from "../services/category.services";

type Category = {
  _id: string;
  name: string;
  isActive?: boolean;
};

type LoadingState = {
  status: boolean;
  delete: boolean;
  checkingProducts: boolean;
};

interface CategoryActionsProps {
  category: Category;
  href: string;
  onEdit?: () => void;
  onStatusChange?: () => void;
  onRefresh?: () => void;
}

export function CategoryActions({
  category,
  href,
  onStatusChange,
  onRefresh,
}: CategoryActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [hasActiveProducts, setHasActiveProducts] = useState<boolean | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState<LoadingState>({
    status: false,
    delete: false,
    checkingProducts: false,
  });

  const handleToggleStatus = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, status: true }));
    const nextStatus = !category.isActive;

    try {
      const response = await fetch(
        `/api/admin/categories/${category._id}/toggle-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: nextStatus }),
        },
      );

      if (!response.ok) throw new Error("Failed to update category status");

      const undo = async () => {
        try {
          const undoRes = await fetch(
            `/api/admin/categories/${category._id}/toggle-status`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isActive: !nextStatus }),
            },
          );

          if (!undoRes.ok) throw new Error("Undo failed");
          toast.success("Undo successful");
          onStatusChange?.();
        } catch {
          toast.error("Undo failed");
        }
      };

      if (!nextStatus) {
        toast(
          ({ closeToast }) => (
            <div className="flex items-center justify-between gap-4">
              <span>Category deactivated</span>
              <button
                onClick={() => {
                  undo();
                  closeToast?.();
                }}
                className="text-sm text-blue-600 underline"
              >
                Undo
              </button>
            </div>
          ),
          { autoClose: 5000 },
        );
      } else {
        toast.success("Category activated");
      }

      onStatusChange?.();
    } catch (error) {
      toast.error(
        `Failed to update category status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, status: false }));
      setDeactivateDialogOpen(false);
    }
  }, [category._id, category.isActive, onStatusChange]);

  // Add handleDelete function
  const handleDelete = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      // Replace with your delete API call
      await deleteCategory(category._id);
      toast.success("Category deleted successfully");
      onRefresh?.();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to delete category: ${error.message}`
          : "Failed to delete category",
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  }, [category._id, onRefresh]);

  const checkActiveProducts = useCallback(async () => {
    if (!category.isActive) {
      handleToggleStatus();
      return;
    }

    setIsLoading((prev) => ({ ...prev, checkingProducts: true }));

    try {
      const res = await fetch(
        `/api/admin/categories/${category._id}/has-active-products`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to check for active products");
      }

      setHasActiveProducts(Boolean(data?.hasActiveProducts));
    } catch {
      toast.error("Failed to check for active products");
    } finally {
      setIsLoading((prev) => ({ ...prev, checkingProducts: false }));
      setDeactivateDialogOpen(true);
    }
  }, [category._id, category.isActive, handleToggleStatus]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-8 h-8 p-0 transition-colors rounded-md hover:bg-muted"
            aria-label="Category actions"
            disabled={isLoading.status || isLoading.delete}
          >
            {isLoading.status || isLoading.delete ? (
              <Icons.spinner className="w-5 h-5 animate-spin" />
            ) : (
              <Icons.moreHorizontal className="w-5 h-5" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-[180px]">
          <Link href={href} prefetch={false}>
            <DropdownMenuItem>
              <Icons.eye className="w-4 h-4 mr-2 text-muted-foreground" />
              View
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            onClick={() => setEditDialogOpen(true)}
            disabled={isLoading.status || isLoading.delete}
          >
            <Icons.edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={checkActiveProducts}
            disabled={isLoading.status || isLoading.delete}
          >
            {isLoading.status ? (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : category.isActive ? (
              <Icons.eyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Icons.eye className="w-4 h-4 mr-2" />
            )}
            {isLoading.status
              ? "Processing..."
              : category.isActive
                ? "Deactivate"
                : "Activate"}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
            disabled={isLoading.status || isLoading.delete}
          >
            <Icons.delete className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        itemName={category.name}
        isDeleting={isLoading.delete}
        onConfirm={handleDelete}
      />

      <DeactivateCategoryDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        categoryName={category.name}
        isLoading={isLoading}
        hasActiveProducts={hasActiveProducts}
        onConfirm={handleToggleStatus}
      />

      <EditCategoryModal
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={category}
        onSuccess={onRefresh}
      />
    </>
  );
}
