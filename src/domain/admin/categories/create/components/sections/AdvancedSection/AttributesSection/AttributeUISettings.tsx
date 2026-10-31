// app/(dashboard)/categories/[id]/components/AttributeUISettings.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/";
import { Input } from "@/components/ui/";

interface AttributeUISettingsProps {
  control: any;
  index: number;
}

const WIDTH_OPTIONS = [
  { value: "full", label: "Full Width" },
  { value: "half", label: "Half Width" },
  { value: "third", label: "Third Width" },
];

export function AttributeUISettings({ control, index }: AttributeUISettingsProps) {
  const { setValue, watch } = useFormContext();

  const width = watch(`attributes.${index}.ui.width`);
  const group = watch(`attributes.${index}.ui.group`);

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium text-gray-900">UI Settings</h5>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`width-${index}`}>Field Width</Label>
          <Select
            value={width}
            onValueChange={(value) =>
              setValue(`attributes.${index}.ui.width`, value)
            }
          >
            <SelectTrigger id={`width-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WIDTH_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`group-${index}`}>Field Group</Label>
          <Input
            id={`group-${index}`}
            value={group || ""}
            onChange={(e) =>
              setValue(`attributes.${index}.ui.group`, e.target.value)
            }
            placeholder="e.g., General, Shipping, Pricing"
          />
          <p className="text-xs text-gray-500">
            Group related fields together in seller forms
          </p>
        </div>
      </div>
    </div>
  );
}