// fields/CheckboxField.tsx

import { Checkbox } from "@/components/ui";
import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";
import { FieldWrapper } from "./FieldWrapper";


export function CheckboxField({
  field,
  fieldProps,
  error,
  disabled,
}: FieldComponentProps) {
  return (
    <FieldWrapper
      field={field}
      error={error}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            Boolean(fieldProps.value)
          }
          disabled={disabled}
          onCheckedChange={(checked) =>
            fieldProps.onChange(
              checked === true,
            )
          }
        />

        <span className="text-sm">
          {field.placeholder ??
            field.label}
        </span>
      </div>
    </FieldWrapper>
  );
}