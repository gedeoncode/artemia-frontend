export interface FieldCondition {
  field: string;
  value: unknown;
}
export const ATTRIBUTE_TYPES = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date",
  ENUM: "enum",
  ARRAY: "array",
  OBJECT: "object",
} as const;

export type AttributeType =
  (typeof ATTRIBUTE_TYPES)[keyof typeof ATTRIBUTE_TYPES];

export type InputType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "email"
  | "phone"
  | "url";

export interface CategoryAttribute {
  key: string;

  label: string;

  type: AttributeType;

  inputType: InputType;

  required?: boolean;

  searchable?: boolean;

  filterable?: boolean;

  sortable?: boolean;

  options?: {
    value: string;
    label: string;
  }[];

  defaultValue?: unknown;

  placeholder?: string;

  helpText?: string;
visibleWhen?: FieldCondition;

  requiredWhen?: FieldCondition;

  disabledWhen?: FieldCondition;

  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    regex?: string;
  };

  ui?: {
    order?: number;

    width?: "full" | "half" | "third";

    group?: string;
  };
}

export interface CategoryFormValues {
  tags: Array<{ value: string }>;
  attributes: CategoryAttribute[];
}