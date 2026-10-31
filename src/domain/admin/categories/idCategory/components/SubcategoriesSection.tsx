"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button/Button";
import { Icons } from "@/components/Icons";
import { EmptySubcategories } from "./EmptySubcategories";
import { SubcategoryCard } from "./SubcategoryCard";
import dynamic from "next/dynamic";
import { Category } from "../../services/types";

const CreateSubCategoryDialog = dynamic(
  () =>
    import("./dialogs/CreateSubcategoryDialog").then(
      (mod) => mod.CreateSubCategoryDialog,
    ),
  { ssr: false },
);

export function SubcategoriesSection({ category }: { category: Category }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Move hooks above early return
  const hasSubcategories =
    category &&
    Array.isArray(category.subcategories) &&
    (category.subcategories?.length ?? 0) > 0;

  const subcategoryNames = useMemo(
    () => category?.subcategories?.map((sc) => sc.name) || [],
    [category?.subcategories],
  );

  const subcategoryCards = useMemo(
    () =>
      category?.subcategories?.map((subcategory) => (
        <SubcategoryCard
          key={subcategory._id}
          subcategory={subcategory}
          parentCategory={category}
        />
      )) || [],
    [category],
  );

  if (!category || !Array.isArray(category.subcategories)) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between p-6 pb-0 space-y-0">
        <CardTitle className="text-lg font-semibold">Subcategories</CardTitle>
        {category.level < 5 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline"
              size="sm"
              aria-label="Add a new subcategory"
            >
              <Icons.add className="w-4 h-4 mr-2" />
              Add Subcategory
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {hasSubcategories ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subcategoryCards}
          </div>
        ) : (
          <EmptySubcategories
            parentCategory={category}
            onAddClick={() => setIsCreateDialogOpen(true)}
          />
        )}
      </CardContent>

      {isCreateDialogOpen && (
        <CreateSubCategoryDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          parentCategoryId={category._id}
          parentLevel={category.level}
          currentSubcategories={subcategoryNames}
          onSuccess={() => setIsCreateDialogOpen(false)}
        />
      )}
    </Card>
  );
}
