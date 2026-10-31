// app/(dashboard)/categories/[id]/components/AttributeBasicFields.tsx
"use client";

import { useEffect, useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/";
import { Label } from "@/components/ui/";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/";
import { toSnakeCase } from "@/lib/utils";

interface AttributeBasicFieldsProps {
  control: any;
  index: number;
  errors: any;
}

const ATTRIBUTE_TYPES = [
  { value: "string", label: "Text (String)" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean (Yes/No)" },
  { value: "date", label: "Date" },
  { value: "enum", label: "Enumeration" },
  { value: "array", label: "Array" },
  { value: "object", label: "Object" },
];

const INPUT_TYPES_BY_TYPE: Record<string, Array<{ value: string; label: string }>> = {
  string: [
    { value: "text", label: "Single-line Text" },
    { value: "textarea", label: "Multi-line Text" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "url", label: "URL" },
  ],
  number: [{ value: "number", label: "Number Input" }],
  boolean: [{ value: "checkbox", label: "Checkbox" }],
  date: [{ value: "date", label: "Date Picker" }],
  enum: [
    { value: "select", label: "Dropdown Select" },
    { value: "radio", label: "Radio Buttons" },
  ],
  array: [{ value: "multiselect", label: "Multi-select" }],
  object: [{ value: "text", label: "Text" }],
};

export function AttributeBasicFields({
  control,
  index,
  errors,
}: AttributeBasicFieldsProps) {
  const { setValue, getValues } = useFormContext();
  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);

  const label = useWatch({
    control,
    name: `attributes.${index}.label`,
  });

  const currentKey = useWatch({
    control,
    name: `attributes.${index}.key`,
  });

  const type = useWatch({
    control,
    name: `attributes.${index}.type`,
  });

  const inputType = useWatch({
    control,
    name: `attributes.${index}.inputType`,
  });

  // Auto-generate key from label
  useEffect(() => {
    if (!isKeyManuallyEdited && label && label !== currentKey) {
      const generatedKey = toSnakeCase(label);
      setValue(`attributes.${index}.key`, generatedKey);
    }
  }, [label, isKeyManuallyEdited, index, setValue, currentKey]);

  // Reset input type when type changes
  useEffect(() => {
    const availableInputTypes = INPUT_TYPES_BY_TYPE[type];
    if (availableInputTypes && availableInputTypes.length > 0) {
      const currentInputType = inputType;
      const isValid = availableInputTypes.some((it) => it.value === currentInputType);
      if (!isValid) {
        setValue(`attributes.${index}.inputType`, availableInputTypes[0].value);
      }
    }
  }, [type, inputType, index, setValue]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsKeyManuallyEdited(true);
    setValue(`attributes.${index}.key`, e.target.value);
  };

  const inputTypes = INPUT_TYPES_BY_TYPE[type] || INPUT_TYPES_BY_TYPE.string;

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium text-gray-900">Basic Information</h5>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`label-${index}`}>
            Label <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`label-${index}`}
            {...control.register(`attributes.${index}.label`)}
            placeholder="e.g., Brand, Size, Color"
          />
          {errors?.label && (
            <p className="text-xs text-red-500">{errors.label.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`key-${index}`}>
            Key <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`key-${index}`}
            {...control.register(`attributes.${index}.key`)}
            onChange={handleKeyChange}
            placeholder="e.g., brand, size, color"
          />
          {errors?.key && (
            <p className="text-xs text-red-500">{errors.key.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`type-${index}`}>Attribute Type</Label>
          <Select
            value={type}
            onValueChange={(value) =>
              setValue(`attributes.${index}.type`, value)
            }
          >
            <SelectTrigger id={`type-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ATTRIBUTE_TYPES.map((typeOption) => (
                <SelectItem key={typeOption.value} value={typeOption.value}>
                  {typeOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`inputType-${index}`}>Input Type</Label>
          <Select
            value={inputType}
            onValueChange={(value) =>
              setValue(`attributes.${index}.inputType`, value)
            }
          >
            <SelectTrigger id={`inputType-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {inputTypes.map((inputOption) => (
                <SelectItem key={inputOption.value} value={inputOption.value}>
                  {inputOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}