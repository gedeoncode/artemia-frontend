"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Icons } from "@/components/Icons";

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

interface CategoryFormValues {
  name: string;
  description?: string;
  image?: string;
  type?: "physical" | "digital";
  requiresPayment?: boolean;
  isFeatured?: boolean;
  status?: "active" | "inactive";
  slug?: string;
  metadata?: Record<string, any>;
}

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryFormValues & { _id: string };
  onSuccess?: () => void;
}

const DEFAULT_FORM_VALUES: CategoryFormValues = {
  name: "",
  description: "",
  image: "",
  type: "physical",
  requiresPayment: false,
  isFeatured: false,
  status: "active",
  slug: "",
  metadata: {},
};

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  onSuccess,
}: EditCategoryModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugIsDirty, setSlugIsDirty] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [formData, setFormData] =
    useState<CategoryFormValues>(DEFAULT_FORM_VALUES);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormValues, string>>
  >({});
  const [imageLoading, setImageLoading] = useState(false);

  // Initialize form with category data
  useEffect(() => {
    if (open && category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        type: category.type || "physical",
        requiresPayment: category.requiresPayment || false,
        isFeatured: category.isFeatured || false,
        status: category.status || "active",
        slug: category.slug || "",
        metadata: category.metadata || {},
      });
      console.log("category data for editing: ", category);
      setSlugIsDirty(false);
      setSlugAvailable(null);
      setErrors({});
      setImageLoading(!!category.image);
    }
  }, [open, category]);

  // Memoized debounced slug generation
  const generateSlug = useMemo(
    () =>
      debounce((name: string) => {
        if (!slugIsDirty && name) {
          const generatedSlug = name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
          setFormData((prev) => ({ ...prev, slug: generatedSlug }));
          setSlugAvailable(null);
        }
      }, 500),
    [slugIsDirty],
  );

  // Memoized debounced slug availability check
  const checkSlugAvailability = useMemo(
    () =>
      debounce(async (slug: string) => {
        if (!slug || slug.length < 2 || slug === category?.slug) {
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
    [category?.slug],
  );

  // Generate slug when name changes
  useEffect(() => {
    generateSlug(formData.name);
    return () => generateSlug.cancel();
  }, [formData.name, generateSlug]);

  // Check slug availability when slug changes
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
    if (errors[name as keyof CategoryFormValues]) {
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
    const newErrors: Partial<Record<keyof CategoryFormValues, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required";
    } else if (formData.slug.length < 2) {
      newErrors.slug = "Slug must be at least 2 characters";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers and hyphens";
    } else if (slugAvailable === false && formData.slug !== category?.slug) {
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
      await axios.put(`/api/admin/categories/${category._id}`, formData);
      toast.success(
        `Category updated successfully, ${formData.name} has been updated.`,
      );
      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        `Failed to update category: ${axiosError.response?.data?.message || axiosError.message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setFormData((prev) => ({ ...prev, image: "" }));
    toast.error(
      "Invalid image URL, The provided image URL could not be loaded",
    );
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg bg-white">
        <DialogHeader className="sticky top-0 z-10 px-1 pt-2 pb-4 bg-white border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Icons.edit className="w-5 h-5" />
            Edit Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the category details below
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
                placeholder="e.g. Electronics, Clothing, Home Decor"
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
                    <Icons.spinner className="w-3 h-3 animate-spin text-muted-foreground" />
                  )}
                  {slugAvailable !== null && !checkingSlug && (
                    <div className="flex items-center gap-1 text-xs">
                      {slugAvailable || formData.slug === category?.slug ? (
                        <span className="flex items-center text-green-600">
                          <Icons.check className="w-3 h-3 mr-1" /> Available
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <Icons.x className="w-3 h-3 mr-1" /> Taken
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
                  placeholder="e.g. electronics, clothing"
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
                placeholder="Brief description of what this category includes"
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

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between p-4 space-x-3 transition-colors border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <Label htmlFor="requiresPayment" className="cursor-pointer">
                    Requires Payment
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Products in this category require payment
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
                <div className="flex-1">
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Category
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Highlight this category on your store
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
                  value={formData.image}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-1 pl-9"
                />
                <Icons.imageIcon className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
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
                          onClick={clearImage}
                          type="button"
                        >
                          Remove
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear image URL</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative w-full h-40 overflow-hidden border rounded-md bg-muted/50">
                    {imageLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <>
                        <img
                          src={formData.image}
                          alt="Category preview"
                          className="object-cover w-full h-full"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <a
                            href={formData.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 transition-colors rounded-full bg-white/80 hover:bg-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icons.linkIcon className="w-4 h-4 text-muted-foreground" />
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 flex flex-col-reverse gap-3 pt-4 pb-4 bg-white border-t sm:flex-row sm:justify-end">
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
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Icons.edit className="w-4 h-4 mr-2" />
                  Update Category
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
