// fields/NumberField.tsx

import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";
import { FieldWrapper } from "./FieldWrapper";
import { Input } from "@headlessui/react";



export function NumberField({
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
      <Input
        id={field.key}
        type="number"
        disabled={disabled}
        placeholder={field.placeholder}
        value={fieldProps.value ?? ""}
        onBlur={fieldProps.onBlur}
        name={fieldProps.name}
        ref={fieldProps.ref}
        aria-invalid={!!error}
        onChange={(e) => {
          const rawValue = e.target.value;

          fieldProps.onChange(
            rawValue === ""
              ? null
              : Number(rawValue),
          );
        }}
      />
    </FieldWrapper>
  );
}