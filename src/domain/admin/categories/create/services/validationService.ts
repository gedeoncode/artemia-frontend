import type {
  CategoryValidationErrors,
  CategoryFormData,
} from "../types/category.types";

export class ValidationService {
  private static instance: ValidationService;

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  async validateField(
    field: keyof CategoryFormData,
    value: any,
    formData?: Partial<CategoryFormData>,
  ): Promise<string | undefined> {
    switch (field) {
      case "name":
        if (!value || value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        if (value.length > 50) {
          return "Name must be less than 50 characters";
        }
        break;

      case "slug":
        if (!value || value.length < 3) {
          return "Slug must be at least 3 characters";
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return "Slug can only contain lowercase letters, numbers, and hyphens";
        }
        break;

      case "image":
        if (value && !/^https?:\/\//.test(value)) {
          return "Image URL must start with http:// or https://";
        }
        break;

      case "allowedModes":
        if (!value || value.length === 0) {
          return "Select at least one selling mode";
        }
        break;
    }

    return undefined;
  }

  async validateForm(
    formData: CategoryFormData,
  ): Promise<CategoryValidationErrors> {
    const errors: CategoryValidationErrors = {};

    // Required fields
    if (!formData.name?.trim()) {
      errors.name = "Name is required";
    } else {
      const nameError = await this.validateField("name", formData.name);
      if (nameError) errors.name = nameError;
    }

    if (!formData.slug?.trim()) {
      errors.slug = "Slug is required";
    } else {
      const slugError = await this.validateField("slug", formData.slug);
      if (slugError) errors.slug = slugError;
    }

    if (!formData.allowedModes?.length) {
      errors.allowedModes = "At least one selling mode is required";
    }

    // Custom validations
    if (formData.isFeatured && !formData.image) {
      errors.image = "Featured categories require an image";
    }

    return errors;
  }
}

export const validationService = ValidationService.getInstance();
