// components/admin/CategoryBreadcrumb.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/";
export function CategoryBreadcrumb({
  categoryId,
  className,
}: {
  categoryId?: string;
  className?: string;
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setBreadcrumbs([]);
      return;
    }

    const fetchBreadcrumbs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/categories/${categoryId}/breadcrumbs`
        );
        const data = await response.json();
        setBreadcrumbs(data);
      } catch (error) {
        console.error("Failed to fetch breadcrumbs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreadcrumbs();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Skeleton className="w-16 h-4" />
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <Skeleton className="w-24 h-4" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center text-sm", className)}>
      <Link
        href="/admin/categories"
        className="flex items-center text-muted-foreground hover:text-foreground"
      >
        <Home className="w-4 h-4 mr-1" />
        Categories
      </Link>

      {breadcrumbs.length > 0 && (
        <>
          <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            {breadcrumbs.map((category, index) => (
              <div key={category._id} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                )}
                <Link
                  href={`/admin/categories?parent=${category._id}`}
                  className={cn(
                    "hover:text-primary",
                    index === breadcrumbs.length - 1
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {category.name}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
