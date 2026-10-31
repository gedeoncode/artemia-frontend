// fields/RadioField.tsx

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";

import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";
import { FieldWrapper } from "./FieldWrapper";


export function RadioField({
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
      <RadioGroup
        value={
          (fieldProps.value as string) ??
          ""
        }
        onValueChange={
          fieldProps.onChange
        }
        disabled={disabled}
      >
        {field.options?.map(
          (option) => (
            <div
              key={option.value}
              className="flex items-center gap-2"
            >
              <RadioGroupItem
                value={option.value}
                id={`${field.key}-${option.value}`}
              />

              <label
                htmlFor={`${field.key}-${option.value}`}
              >
                {option.label}
              </label>
            </div>
          ),
        )}
      </RadioGroup>
    </FieldWrapper>
  );
}