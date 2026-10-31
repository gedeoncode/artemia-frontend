// fields/MultiSelectField.tsx

import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";
import { FieldWrapper } from "./FieldWrapper";
import { Checkbox } from "@/components/ui";

export function toggleArrayValue<T>(
  values: T[],
  value: T,
  checked: boolean,
): T[] {
  if (checked) {
    return values.includes(value) ? values : [...values, value];
  }

  return values.filter((item) => item !== value);
}
export function MultiSelectField({
  field,
  fieldProps,
  error,
  disabled,
}: FieldComponentProps) {
  const selected = (fieldProps.value as string[]) ?? [];

  return (
    <FieldWrapper field={field} error={error}>
      <div className="grid gap-3 sm:grid-cols-2">
        {" "}
        {field.options?.map((option) => {
          const checked = selected.includes(option.value);

          return (
            <label key={option.value} className="flex items-center gap-2">
              <Checkbox
                checked={checked}
                disabled={disabled}
                onCheckedChange={(checked) =>
                  fieldProps.onChange(
                    toggleArrayValue(selected, option.value, checked === true),
                  )
                }
              />

              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
