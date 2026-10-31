// dynamic-form/registry.ts
import { FieldComponentProps } from "@/domain/seller/products/add/types/categoryAttributes.types";
import { ComponentType } from "react";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";
import { MultiSelectField } from "./fields/MultiSelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { RadioField } from "./fields/RadioField";


export const FIELD_REGISTRY: Record<
  string,
  ComponentType<FieldComponentProps>
> = {
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  multiselect: MultiSelectField,
  checkbox: CheckboxField,
  radio: RadioField,
};