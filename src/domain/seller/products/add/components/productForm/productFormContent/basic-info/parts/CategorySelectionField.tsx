"use client";
import {
  CategoryTreeModalSelect,
} from "../categorySection";
import { Category } from "@/types";
type Props = {
  categories: Category[];
  isEdit?: boolean;
};
export const CategorySpecificSection = ({
  categories,
  isEdit,
}: Props) => (
  <div className="space-y-3">
    <CategoryTreeModalSelect
      categories={categories}
      isEdit={isEdit}
      required
      // touched={touched}
    />


  </div>
);
