// app/(dashboard)/categories/[id]/components/AttributesSection.tsx
"use client";

import { useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/";
import { AttributeCard } from "./AttributeCard";
import { EmptyAttributeState } from "./EmptyState";
import { CategoryAttribute } from "@/types";

interface AttributesSectionProps {
  control: any;
  errors: any;
}

export function AttributesSection({ control, errors }: AttributesSectionProps) {
  const { fields, append, remove, swap, insert, update } = useFieldArray({
    control,
    name: "attributes",
    keyName: "rhfId",
  });

  const handleAddAttribute = () => {
    const newAttribute: CategoryAttribute = {
      key: `attribute_${Date.now()}`,
      label: "New Attribute",
      type: "string",
      inputType: "text",
      required: false,
      searchable: false,
      filterable: false,
      sortable: false,
      options: [],
      validation: {},
      ui: {
        order: fields.length,
        width: "full",
        group: "",
      },
    };
    append(newAttribute);
  };

  const handleDuplicate = (index: number) => {
    const attribute = fields[index] as CategoryAttribute;
    const duplicated = {
      ...attribute,
      key: `${attribute.key}_copy`,
      label: `${attribute.label} (Copy)`,
      ui: {
        ...attribute.ui,
        order: index + 1,
      },
    };
    insert(index + 1, duplicated);
  };

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    swap(dragIndex, dropIndex);
    // Update order values
    fields.forEach((_, idx) => {
      update(idx, { ...fields[idx], ui: { ...fields[idx].ui, order: idx } });
    });
  };

  if (fields.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Category Attributes
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Define custom attributes for product listings
            </p>
          </div>
          <Button
            onClick={handleAddAttribute}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Attribute
          </Button>
        </div>
        <EmptyAttributeState onAdd={handleAddAttribute} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Category Attributes
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage product attributes ({fields.length} total)
          </p>
        </div>
        <Button
        type="button"
          onClick={handleAddAttribute}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Attribute
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field: any, index: number) => (
          <AttributeCard
            key={field.rhfId}
            control={control}
            index={index}
            attribute={field}
            onRemove={() => remove(index)}
            onDuplicate={() => handleDuplicate(index)}
            onReorder={handleReorder}
            totalAttributes={fields.length}
            errors={errors?.attributes?.[index]}
          />
        ))}
      </div>
    </div>
  );
}
