// /dynamicForm/DynamicForm.tsx

import { useMemo } from "react";
import { CategoryAttribute } from "@/types/category/CategoryAttribute.types";
import { DynamicField } from "./DynamicFields";

type FormGroupLayout = {
  id: string;
  columns: 1 | 2 | 3 | 4;
  className?: string;
};

interface DynamicFormProps {
  attributes: CategoryAttribute[];
  groupLayouts?: FormGroupLayout[];
}

const defaultGroupLayout: FormGroupLayout = {
  id: "default",
  columns: 2,
};
function getWidthClass(width?: "full" | "half" | "third") {
  switch (width) {
    case "full":
      return "md:col-span-full";
    case "half":
      return "md:col-span-1";
    case "third":
      return "md:col-span-1 md:col-span-1"; // placeholder for future 3-col logic
    default:
      return "md:col-span-1";
  }
}

export function DynamicForm({
  attributes,
  groupLayouts = [],
}: DynamicFormProps) {
  const layoutMap = useMemo(() => {
    return new Map(
      [defaultGroupLayout, ...groupLayouts].map((g) => [g.id, g])
    );
  }, [groupLayouts]);

  const grouped = useMemo(() => {
    const sorted = [...attributes].sort(
      (a, b) => (a.ui?.order ?? 0) - (b.ui?.order ?? 0)
    );

    return sorted.reduce<Record<string, CategoryAttribute[]>>((acc, attr) => {
      const group = attr.ui?.group ?? "default";

      if (!acc[group]) acc[group] = [];
      acc[group].push(attr);

      return acc;
    }, {});
  }, [attributes]);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([groupId, fields]) => {
        const layout = layoutMap.get(groupId) ?? defaultGroupLayout;

        return (
          <div key={groupId} className={layout.className}>
            <div
              className={`grid gap-4 grid-cols-1 ${
                layout.columns === 1
                  ? ""
                  : layout.columns === 2
                  ? "md:grid-cols-2"
                  : layout.columns === 3
                  ? "md:grid-cols-3"
                  : "md:grid-cols-4"
              }`}
            >
              {fields.map((field) => (
                <div key={field.key} className={getWidthClass(field.ui?.width)}>
                  <DynamicField field={field} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}