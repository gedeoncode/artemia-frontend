"use client";

import { Category } from "../../services/types";
import { CategoryDetails } from "./CategoryDetails";
import { CategorySidebar } from "./CategorySidebar";
import { SubcategoriesSection } from "./SubcategoriesSection";

export function CategoryContent({ category }: { category: Category }) {
  return (
    <section className="px-4 py-6 space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <CategoryDetails category={category} />
        </div>
        <aside className="lg:col-span-1">
          <CategorySidebar category={category} />
        </aside>
      </div>

      <div>
        <SubcategoriesSection category={category} />
      </div>
    </section>
  );
}
