import {
  FieldErrors,
  FieldValues,
} from "react-hook-form";

export function nestResolverErrors<
  T extends FieldValues,
>(
  prefix: string,
  errors: FieldErrors,
): FieldErrors<T> {
  if (
    !errors ||
    Object.keys(errors).length === 0
  ) {
    return {};
  }

  return {
    [prefix]: errors,
  } as FieldErrors<T>;
}