"use client";

import * as React from "react";
import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils/";
import { Calendar } from "@/components/ui/Calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/button/Button";

type FormDatePickerProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;

  placeholder?: string;
  description?: string;

  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;

  formatString?: string;
};

export function FormDatePicker<TFormValues extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Select date",
  description,
  minDate,
  maxDate,
  disabled = false,
  formatString = "PPP",
}: FormDatePickerProps<TFormValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  aria-invalid={!!fieldState.error}
                  className={cn(
                    "justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {field.value
                    ? format(field.value, formatString)
                    : placeholder}
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
