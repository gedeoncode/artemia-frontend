// app/(dashboard)/categories/[id]/components/AttributeValidationFields.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/";
import { Label } from "@/components/ui/";

interface AttributeValidationFieldsProps {
  control: any;
  index: number;
  type: string;
}

export function AttributeValidationFields({
  control,
  index,
  type,
}: AttributeValidationFieldsProps) {
  const { register } = useFormContext();

  const renderStringValidation = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`minLength-${index}`}>Minimum Length</Label>
        <Input
          id={`minLength-${index}`}
          type="number"
          {...register(`attributes.${index}.validation.minLength`, {
            valueAsNumber: true,
          })}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`maxLength-${index}`}>Maximum Length</Label>
        <Input
          id={`maxLength-${index}`}
          type="number"
          {...register(`attributes.${index}.validation.maxLength`, {
            valueAsNumber: true,
          })}
          placeholder="255"
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor={`regex-${index}`}>Regex Pattern</Label>
        <Input
          id={`regex-${index}`}
          {...register(`attributes.${index}.validation.regex`)}
          placeholder="^[A-Za-z]+$"
        />
      </div>
    </div>
  );

  const renderNumberValidation = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`min-${index}`}>Minimum Value</Label>
        <Input
          id={`min-${index}`}
          type="number"
          {...register(`attributes.${index}.validation.min`, {
            valueAsNumber: true,
          })}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`max-${index}`}>Maximum Value</Label>
        <Input
          id={`max-${index}`}
          type="number"
          {...register(`attributes.${index}.validation.max`, {
            valueAsNumber: true,
          })}
          placeholder="100"
        />
      </div>
    </div>
  );

  if (type === "string") return renderStringValidation();
  if (type === "number") return renderNumberValidation();

  return null;
}