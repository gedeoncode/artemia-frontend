// components/dynamic-form/utils/buildValidationRules.ts

import {
  RegisterOptions,
} from "react-hook-form";

import { CategoryAttribute } from "@/types/category/CategoryAttribute.types";

export function buildValidationRules(
  field: CategoryAttribute,
  isRequired?: boolean,
): RegisterOptions {
  const rules: RegisterOptions = {};

  if (isRequired) {
    rules.required = `${field.label} est requis`;
  }

  const validation =
    field.validation;

  if (!validation) {
    return rules;
  }

  if (
    validation.min !== undefined
  ) {
    rules.min = {
      value: validation.min,
      message: `${field.label} doit être supérieur ou égal à ${validation.min}`,
    };
  }

  if (
    validation.max !== undefined
  ) {
    rules.max = {
      value: validation.max,
      message: `${field.label} doit être inférieur ou égal à ${validation.max}`,
    };
  }

  if (
    validation.minLength !==
    undefined
  ) {
    rules.minLength = {
      value:
        validation.minLength,
      message: `${field.label} doit contenir au moins ${validation.minLength} caractères`,
    };
  }

  if (
    validation.maxLength !==
    undefined
  ) {
    rules.maxLength = {
      value:
        validation.maxLength,
      message: `${field.label} ne peut pas dépasser ${validation.maxLength} caractères`,
    };
  }

  if (validation.regex) {
    rules.pattern = {
      value: new RegExp(
        validation.regex,
      ),
      message: `${field.label} a un format invalide`,
    };
  }

  return rules;
}