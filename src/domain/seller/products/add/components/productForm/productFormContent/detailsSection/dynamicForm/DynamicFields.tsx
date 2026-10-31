// components/dynamic-form/DynamicField.tsx

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { FIELD_REGISTRY } from "./registry";

import { UnsupprtedField } from "./fields/UnsuportedField";

import { CategoryAttribute } from "@/types/category/CategoryAttribute.types";
import { buildValidationRules } from "./utils/buildValidationRules";
import { memo, useMemo } from "react";
import {
  getFieldName,
  isAttributeDisabled,
  isAttributeRequired,
  isAttributeVisible,
} from "@/domain/seller/products/add/utils";

interface DynamicFieldProps {
  field: CategoryAttribute;
}
export const DynamicField = memo(function DynamicField({
  field,
}: DynamicFieldProps) {
  const { control } = useFormContext();

  const details = useWatch({
    control,

    name: "details",
  });

  const Component = FIELD_REGISTRY[field.inputType];

  if (!Component) {
    return <UnsupprtedField fieldType={field.inputType} />;
  }

  const isVisible = isAttributeVisible(
    field,

    details,
  );

  if (!isVisible) {
    return null;
  }

  const isDisabled = isAttributeDisabled(
    field,

    details,
  );

  const isRequired = isAttributeRequired(
    field,

    details,
  );

  const rules = useMemo(
    () =>
      buildValidationRules(
        field,

        isRequired,
      ),

    [field, isRequired],
  );

  return (
    <Controller
      name={getFieldName(field.key)}
      control={control}
      rules={rules}
      render={({
        field: rhfField,

        fieldState,
      }) => (
        <Component
          field={field}
          fieldProps={rhfField}
          error={fieldState.error}
          disabled={isDisabled}
        />
      )}
    />
  );
});
