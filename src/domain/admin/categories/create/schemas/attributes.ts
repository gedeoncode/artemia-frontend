import { z } from "zod";

export const attributeOptionSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

export const attributeValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),

  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().nonnegative().optional(),

  regex: z.string().optional(),
});

export const attributeUISchema = z.object({
  order: z.number().int().default(0),

  width: z.enum(["full", "half", "third"]).default("full"),

  group: z.string().optional(),
});

export const attributeSchema = z.object({
  key: z.string().trim().min(1),

  label: z.string().trim().min(1),

  type: z.enum([
    "string",
    "number",
    "boolean",
    "date",
    "enum",
    "array",
    "object",
  ]),

  inputType: z.enum([
    "text",
    "textarea",
    "number",
    "select",
    "multiselect",
    "checkbox",
    "radio",
    "date",
    "email",
    "phone",
    "url",
  ]),

  required: z.boolean().default(false),

  searchable: z.boolean().default(false),

  filterable: z.boolean().default(false),

  sortable: z.boolean().default(false),

  options: z.array(attributeOptionSchema).default([]),

  placeholder: z.string().optional(),

  helpText: z.string().optional(),

  defaultValue: z.any().optional(),

  validation: attributeValidationSchema.optional(),

  ui: attributeUISchema.optional(),
});

export type AttributeSchemaType = z.infer<typeof attributeSchema>;

export const emptyAttribute: AttributeSchemaType = {
  key: "",
  label: "",
  type: "string",
  inputType: "text",

  required: false,
  searchable: false,
  filterable: false,
  sortable: false,

  options: [],

  placeholder: "",

  helpText: "",

  defaultValue: undefined,

  validation: {},

  ui: {
    order: 0,
    width: "full",
    group: "",
  },
};