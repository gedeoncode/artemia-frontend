// fields/TextareaField.tsx

import { Textarea } from "@/components/ui";
import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";
import { FieldWrapper } from "./FieldWrapper";



export function TextareaField({
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
  <Textarea
  {...fieldProps}
  id={field.key}
  disabled={disabled}
  placeholder={field.placeholder}
  value={
    (fieldProps.value as string) ?? ""
  }
  rows={6}
  aria-invalid={!!error}
/>
    </FieldWrapper>
  );
}