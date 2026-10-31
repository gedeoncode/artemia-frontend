// app/(dashboard)/categories/[id]/components/AttributeOptionsEditor.tsx
"use client";

import { useFieldArray, useWatch } from "react-hook-form";
import { GripVertical, X, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/";
import { Input } from "@/components/ui/";
import { Label } from "@/components/ui/";
import { toSnakeCase } from "@/lib/utils";
import { useState } from "react";

interface AttributeOptionsEditorProps {
  control: any;
  index: number;
}

export function AttributeOptionsEditor({
  control,
  index,
}: AttributeOptionsEditorProps) {
  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: `attributes.${index}.options`,
  });

  const [errors, setErrors] = useState<Record<number, string>>({});

  const watchOptions = useWatch({
    control,
    name: `attributes.${index}.options`,
  });

  const addOption = () => {
    const newOption = {
      value: `option_${Date.now()}`,
      label: "New Option",
    };
    append(newOption);
  };

  const updateOptionLabel = (optionIndex: number, label: string) => {
    // Check for duplicate labels
    const duplicate = fields.some(
      (field: any, idx: number) => idx !== optionIndex && field.label === label,
    );

    if (duplicate) {
      setErrors((prev) => ({
        ...prev,
        [optionIndex]: "Option label must be unique",
      }));
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[optionIndex];
      return newErrors;
    });

    const value = toSnakeCase(label);
    update(optionIndex, { label, value });
  };

  const updateOptionValue = (optionIndex: number, value: string) => {
    // Check for duplicate values
    const duplicate = fields.some(
      (field: any, idx: number) => idx !== optionIndex && field.value === value,
    );

    if (duplicate) {
      setErrors((prev) => ({
        ...prev,
        [optionIndex]: "Option value must be unique",
      }));
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[optionIndex];
      return newErrors;
    });

    update(optionIndex, { ...fields[optionIndex], value });
  };

  const moveOption = (fromIndex: number, toIndex: number) => {
    swap(fromIndex, toIndex);
  };

  if (fields.length === 0) {
    return (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">No options defined</p>
          <Button
            type="button"
            onClick={addOption}
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Option
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-900">Options</h5>
        <Button
          type="button"
          onClick={addOption}
          variant="outline"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Option
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field: any, optionIndex: number) => (
          <div
            key={field.id}
            className="flex items-center gap-3 p-3 bg-white border rounded-lg"
          >
            <div className="cursor-move">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) =>
                    updateOptionLabel(optionIndex, e.target.value)
                  }
                  placeholder="Option label"
                  className={errors[optionIndex] ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label className="text-xs">Value</Label>
                <Input
                  value={field.value}
                  onChange={(e) =>
                    updateOptionValue(optionIndex, e.target.value)
                  }
                  placeholder="Option value"
                  className={errors[optionIndex] ? "border-red-500" : ""}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(optionIndex)}
              className="text-red-600 hover:text-red-700"
              leftIcon={              <X className="w-4 h-4" />
}
            >
            </Button>
          </div>
        ))}

        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="text-sm text-red-700">
              Please fix option duplication issues
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
