"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categoryDefaultValues, categorySchema, CategorySchemaType } from "../schemas/";

const getDefaultValues = (): CategorySchemaType => 
categoryDefaultValues
;

export function useCategoryForm() {
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    form.reset(getDefaultValues());
  }, [form]);

  return {
    form,

    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  };
}
