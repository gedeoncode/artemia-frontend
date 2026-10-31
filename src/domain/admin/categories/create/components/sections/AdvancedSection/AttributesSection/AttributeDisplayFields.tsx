// app/(dashboard)/categories/[id]/components/AttributeDisplayFields.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/";
import { Label } from "@/components/ui/";
import { Textarea } from "@/components/ui/";

interface AttributeDisplayFieldsProps {
  control: any;
  index: number;
}

export function AttributeDisplayFields({
  control,
  index,
}: AttributeDisplayFieldsProps) {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium text-gray-900">Display</h5>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`placeholder-${index}`}>Placeholder</Label>
          <Input
            id={`placeholder-${index}`}
            {...register(`attributes.${index}.placeholder`)}
            placeholder="e.g., Enter product brand..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`defaultValue-${index}`}>Default Value</Label>
          <Input
            id={`defaultValue-${index}`}
            {...register(`attributes.${index}.defaultValue`)}
            placeholder="Optional default value"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor={`helpText-${index}`}>Help Text</Label>
          <Textarea
            id={`helpText-${index}`}
            {...register(`attributes.${index}.helpText`)}
            placeholder="Additional guidance for sellers"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}