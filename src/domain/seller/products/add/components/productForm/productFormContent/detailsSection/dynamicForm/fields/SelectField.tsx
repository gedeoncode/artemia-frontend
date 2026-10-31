// fields/SelectField.tsx

import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";
import { FieldWrapper } from "./FieldWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

export function SelectField({
  field,
  fieldProps,
  error,
  disabled,
}: FieldComponentProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <Select
        value={(fieldProps.value as string) ?? ""}
        onValueChange={fieldProps.onChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Sélectionnez ${field.label}`} />
        </SelectTrigger>

        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
