"use client";
import Link from "next/link";
import { Category } from "../../../../../../domain/admin/categories/services/types";
import { Button } from "@/components/ui/button/Button";
import { Icons } from "@/components/Icons";
export function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-4 px-4 py-3 border-b md:flex-row md:items-center md:justify-between bg-background/50 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {category.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium">Category ID:</span> {category._id}{" "}
          &nbsp;|&nbsp;
          <span className="font-medium">Level:</span> {category.level}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/manage-categories/${category._id}`}
          prefetch={false}
        >
          <Button variant="outline" aria-label="Edit Category">
            <Icons.edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Link href="/admin/manage-categories" prefetch={false}>
          <Button variant="ghost" aria-label="Back to Categories">
            <Icons.chevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
