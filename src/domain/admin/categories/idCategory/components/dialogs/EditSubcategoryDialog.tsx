"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  PencilIcon,
  Loader2,
  Image as ImageIcon,
  Link,
  Check,
  X,
} from "lucide-react";
import debounce from "lodash.debounce";

import { Button } from "@/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

import type {
  CategoryType,
  CategoryStatus,
} from "../../../../../../../domain/admin/categories/services/types"; // Adjust import path as needed

export interface SubCategoryFormValues {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type: CategoryType; // made required
  status: CategoryStatus; // made required
  requiresPayment: boolean;
  isFeatured: boolean;
  metadata?: Record<string, any>;
  parent: string; // parent category _id
  level: number;
}

interface EditSubCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  subcategory: SubCategoryFormValues & { id: string };
  currentSubcategories?: string[];
}

export function EditSubcategoryDialog({
  open,
  onOpenChange,
  onSuccess,
  subcategory,
  currentSubcategories = [],
}: EditSubCategoryDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugIsDirty, setSlugIsDirty] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [formData, setFormData] = useState<SubCategoryFormValues>({
    name: "",
    description: "",
    image: "",
    type: "physical",
    requiresPayment: false,
    isFeatured: false,
    status: "active",
    slug: "",
    metadata: {},
    parent: "",
    level: 1,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SubCategoryFormValues, string>>
  >({});

  // Initialize form with subcategory data
  useEffect(() => {
    if (open && subcategory) {
      setFormData({
        name: subcategory.name,
        description: subcategory.description || "",
        image: subcategory.image || "",
        type: subcategory.type || "physical",
        requiresPayment: subcategory.requiresPayment || false,
        isFeatured: subcategory.isFeatured || false,
        status: subcategory.status || "active",
        slug: subcategory.slug,
        metadata: subcategory.metadata || {},
        parent: subcategory.parent,
        level: subcategory.level,
      });
      setSlugIsDirty(true); // Assume slug is already set for existing subcategory
    }
  }, [open, subcategory]);

  // Debounced slug generation with cleanup
  const generateSlug = useCallback(
    debounce((name: string) => {
      if (!slugIsDirty && name) {
        const generatedSlug = name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");
        setFormData((prev) => ({ ...prev, slug: generatedSlug }));
        setSlugAvailable(null); // Reset availability when slug changes
      }
    }, 500),
    [slugIsDirty],
  );

  // Check slug availability (excluding current subcategory's slug)
  const checkSlugAvailability = useCallback(
    debounce(async (slug: string) => {
      if (!slug || slug.length < 2 || slug === subcategory.slug) {
        setSlugAvailable(null);
        return;
      }
      try {
        setCheckingSlug(true);
        const response = await axios.get(
          `/api/admin/categories/check-slug?slug=${slug}`,
        );
        setSlugAvailable(response.data.available);
      } catch (error) {
        console.error("Error checking slug availability:", error);
        setSlugAvailable(null);
      } finally {
        setCheckingSlug(false);
      }
    }, 800),
    [subcategory.slug],
  );

  useEffect(() => {
    generateSlug(formData.name);
    return () => generateSlug.cancel();
  }, [formData.name, generateSlug]);

  useEffect(() => {
    if (formData.slug && formData.slug.length >= 2) {
      checkSlugAvailability(formData.slug);
    } else {
      setSlugAvailable(null);
    }
    return () => checkSlugAvailability.cancel();
  }, [formData.slug, checkSlugAvailability]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "slug") setSlugIsDirty(true);
    if (errors[name as keyof SubCategoryFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof SubCategoryFormValues, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (
      currentSubcategories.includes(formData.name) &&
      formData.name !== subcategory.name
    ) {
      newErrors.name = "A subcategory with this name already exists";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (formData.slug.length < 2) {
      newErrors.slug = "Slug must be at least 2 characters";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers and hyphens";
    } else if (slugAvailable === false && formData.slug !== subcategory.slug) {
      newErrors.slug = "This slug is already in use";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await axios.put(`/api/admin/categories/${subcategory.id}`, formData);
      toast.success(
        `Subcategory updated successfully. Changes to ${formData.name} have been saved.`,
      );
      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        `Failed to update subcategory: ${axiosError.response?.data?.message || axiosError.message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg bg-white">
        <DialogHeader className="sticky top-0 z-10 px-1 pt-2 pb-4 bg-white border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <PencilIcon className="w-5 h-5" />
            Edit Subcategory
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the details of this subcategory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="px-1 pb-2 space-y-6">
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Name <span className="text-red-500">*</span>
                </Label>
                {errors.name && (
                  <span className="text-xs text-red-500">{errors.name}</span>
                )}
              </div>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Smartphones, T-Shirts, Furniture"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-1"
                aria-invalid={!!errors.name}
              />
            </div>

            {/* Slug Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug" className="flex items-center gap-1">
                  URL Slug <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  {checkingSlug && (
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  )}
                  {slugAvailable !== null && !checkingSlug && (
                    <div className="flex items-center gap-1 text-xs">
                      {slugAvailable || formData.slug === subcategory.slug ? (
                        <span className="flex items-center text-green-600">
                          <Check className="w-3 h-3 mr-1" /> Available
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <X className="w-3 h-3 mr-1" /> Taken
                        </span>
                      )}
                    </div>
                  )}
                  {errors.slug && !checkingSlug && (
                    <span className="text-xs text-red-500">{errors.slug}</span>
                  )}
                </div>
              </div>
              <div className="relative">
                <Input
                  id="slug"
                  name="slug"
                  placeholder="e.g. smartphones, t-shirts"
                  value={formData.slug}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="pl-8 mt-1"
                  aria-invalid={!!errors.slug}
                />
                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                  /
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {!slugIsDirty && formData.name
                  ? "Slug will be auto-generated from name"
                  : "Customize your URL slug (lowercase, hyphens allowed)"}
              </p>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of what this subcategory includes (shown to customers)"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                rows={3}
                className="mt-1 min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Optional but recommended for SEO
              </p>
            </div>

            {/* Type and Status Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Product Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleSelectChange("type", value as "physical" | "digital")
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Physical</Badge>
                        <span className="text-xs text-muted-foreground">
                          (Tangible goods)
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="digital">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Digital</Badge>
                        <span className="text-xs text-muted-foreground">
                          (Downloads, services)
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value as "active" | "inactive")
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle Switches in Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between p-4 space-x-3 transition-colors border rounded-lg hover:bg-muted/50">
                <div>
                  <Label htmlFor="requiresPayment" className="cursor-pointer">
                    Requires Payment
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Products in this subcategory require payment
                  </p>
                </div>
                <Switch
                  id="requiresPayment"
                  checked={formData.requiresPayment}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("requiresPayment", checked)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between p-4 space-x-3 transition-colors border rounded-lg hover:bg-muted/50">
                <div>
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Subcategory
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Highlight this subcategory on your store
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isFeatured", checked)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Image URL Field */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <div className="relative">
                <Input
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-1 pl-9"
                />
                <ImageIcon className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
              </div>

              {formData.image && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">
                      Image Preview:
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-muted-foreground"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, image: "" }))
                          }
                          type="button"
                        >
                          Remove
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear image URL</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative w-full h-40 overflow-hidden border rounded-md bg-muted/50">
                    {isLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="object-cover w-full h-full"
                          onLoad={() => setIsLoading(false)}
                          onError={() => setIsLoading(false)}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          {!isLoading && (
                            <a
                              href={formData.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 transition-colors rounded-full bg-white/80 hover:bg-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link className="w-4 h-4 text-muted-foreground" />
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 flex flex-col-reverse gap-3 pt-2 pt-4 pb-4 bg-white border-t sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || checkingSlug}
              className="sm:w-auto"
              aria-label="Update subcategory"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Update Subcategory
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
