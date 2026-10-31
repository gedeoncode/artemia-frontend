// fields/TextField.tsx

import { Input } from "@/components/ui/";

import { FieldWrapper } from "./FieldWrapper";
import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";


export function TextField({
  field,
  fieldProps,
  error,
}: FieldComponentProps) {
  return (
    <FieldWrapper
      field={field}
      error={error}
    >
      <Input
        {...fieldProps}
        id={field.key}
        type="text"
        placeholder={field.placeholder}
        value={
          (fieldProps.value as string) ?? ""
        }
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}