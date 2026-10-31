// components/dynamic-form/FieldWrapper.tsx

import { ReactNode } from "react";

import { CategoryAttribute } from "@/types/category/CategoryAttribute.types";
import { FieldError } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/Form";

interface FieldWrapperProps {
  field: CategoryAttribute;
  error?: FieldError;
  children: ReactNode;
}

export function FieldWrapper({
  field,
  error,
  children,
}: FieldWrapperProps) {
  return (
    <FormItem className="space-y-2">
      <FormLabel htmlFor={field.key} className="text-sm font-medium">
        {field.label}
        {field.required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </FormLabel>

      {field.description && (
        <FormDescription>{field.description}</FormDescription>
      )}

      {children}

      {error?.message && (
        <FormMessage>{error.message}</FormMessage>
      )}
    </FormItem>
  );
}