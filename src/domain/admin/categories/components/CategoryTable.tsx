import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";

import { Badge } from "@/components/ui/Badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { formatDate } from "@/lib/utils/";

import { CategoryActions } from "./CategoryActions";
import { CategoryBreadcrumb } from "./CategoryBreadcrump";

import { CategoryTableProps } from "../services/types";

export function CategoryTable({
  categories,
  onEdit,
  onStatusChange,
  onRefresh,
  isLoading,
  renderSkeleton
}: CategoryTableProps) {
  const hasCategories =
    categories.length > 0;

  return (
    <div className="overflow-hidden border rounded-lg">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[300px]">
              Category
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead className="text-center">
              Products
            </TableHead>

            <TableHead className="text-center">
              Subcategories
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Featured
            </TableHead>

            <TableHead>
              Updated
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? renderSkeleton() : !hasCategories ? (
            <TableRow>
              <TableCell colSpan={8} className="h-64">
                <EmptyState
                  title="No categories found"
                  description="There are no categories in the system yet"
                  icon="package"
                />
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow
                key={category._id}
                className="hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <Link
                      href={`/admin/manage-categories/${category._id}`}
                      className="font-medium hover:underline"
                      prefetch={false}
                    >
                      {category.name}
                    </Link>

                    {category.parent && (
                      <CategoryBreadcrumb
                        categoryId={category.parent._id}
                        className="text-xs text-muted-foreground"
                      />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize"
                  >
                    {category.type}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  {(
                    category.productCount || 0
                  ).toLocaleString()}
                </TableCell>

                <TableCell className="text-center">
                  {(
                    category.descendantCount || 0
                  ).toLocaleString()}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      category.status === "active"
                        ? "success"
                        : category.status ===
                            "archived"
                          ? "secondary"
                          : "danger"
                    }
                    className="capitalize"
                  >
                    {category.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  {category.isFeatured ? (
                    <Badge variant="default">
                      Featured
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      —
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(category.updatedAt)}
                </TableCell>

                <TableCell className="text-right">
                  <CategoryActions
                    category={category}
                    href={`/admin/manage-categories/${category._id}`}
                    onEdit={() =>
                      onEdit?.(category)
                    }
                    onStatusChange={
                      onStatusChange
                    }
                    onRefresh={onRefresh}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}