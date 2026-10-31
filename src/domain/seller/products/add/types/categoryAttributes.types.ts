// types/category-attribute.ts

import { CategoryAttribute } from "@/types/category/CategoryAttribute.types";

import {
  ControllerRenderProps,
  FieldError,
} from "react-hook-form";

export interface FieldComponentProps {
  field: CategoryAttribute;

  fieldProps: ControllerRenderProps;

  error?: FieldError;

  disabled?: boolean;
}