// app/(dashboard)/categories/[id]/components/AttributeBehaviorFields.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/";
import { Label } from "@/components/ui/";

interface AttributeBehaviorFieldsProps {
  index: number;
}

export function AttributeBehaviorFields({
  index,
}: AttributeBehaviorFieldsProps) {
  const { setValue, watch } = useFormContext();

  const required = watch(`attributes.${index}.required`);
  const searchable = watch(`attributes.${index}.searchable`);
  const filterable = watch(`attributes.${index}.filterable`);
  const sortable = watch(`attributes.${index}.sortable`);

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium text-gray-900">Behavior</h5>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`required-${index}`} className="font-normal">
              Required Field
            </Label>
            <p className="text-xs text-gray-500">
              Must be filled by sellers
            </p>
          </div>
          <Switch
            id={`required-${index}`}
            checked={required}
            onCheckedChange={(checked) =>
              setValue(`attributes.${index}.required`, checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`searchable-${index}`} className="font-normal">
              Searchable
            </Label>
            <p className="text-xs text-gray-500">
              Include in product search
            </p>
          </div>
          <Switch
            id={`searchable-${index}`}
            checked={searchable}
            onCheckedChange={(checked) =>
              setValue(`attributes.${index}.searchable`, checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`filterable-${index}`} className="font-normal">
              Filterable
            </Label>
            <p className="text-xs text-gray-500">
              Show in category filters
            </p>
          </div>
          <Switch
            id={`filterable-${index}`}
            checked={filterable}
            onCheckedChange={(checked) =>
              setValue(`attributes.${index}.filterable`, checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`sortable-${index}`} className="font-normal">
              Sortable
            </Label>
            <p className="text-xs text-gray-500">
              Allow sorting by this attribute
            </p>
          </div>
          <Switch
            id={`sortable-${index}`}
            checked={sortable}
            onCheckedChange={(checked) =>
              setValue(`attributes.${index}.sortable`, checked)
            }
          />
        </div>
      </div>
    </div>
  );
}