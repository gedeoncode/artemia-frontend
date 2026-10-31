"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import { Icons } from "@/components/Icons";
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
import { ModeRulesForm } from "../ModeRulesForm";
import HomepageRuleForm from "../HomepageRules";
import { Category } from "../../services/types";
import { Checkbox } from "@/components/ui/Checkbox";
import { API_BASE_URL } from "@/config/env";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onRefetch?: () => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
  onRefetch,
}: CreateCategoryDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugIsDirty, setSlugIsDirty] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [formData, setFormData] = useState<Category>({
    name: "",
    description: "",
    image: "",
    type: "physical",
    requiresPayment: false,
    isFeatured: false,
    status: "active",
    slug: "",
    metadata: {},
    parent: null,
    allowedModes: ["PAL"],
    modeRules: {},
    homepageRules: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Category, string>>>(
    {},
  );

  // Fetch parent categories (active only)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/admin/categories?status=active");
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    if (open) fetchCategories();
  }, [open]);

  // Debounced slug generation with cleanup
  const generateSlug = useCallback(
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

  // Check slug availability
  const checkSlugAvailability = useCallback(
    debounce(async (slug: string) => {
      if (!slug || slug.length < 2) {
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
    [],
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

  // Reset form when dialog closes with animation timing
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          image: "",
          type: "physical",
          requiresPayment: false,
          isFeatured: false,
          status: "active",
          slug: "",
          metadata: {},
          parent: null,
          allowedModes: ["PAL"],
          modeRules: {},
          homepageRules: [],
        });
        setSlugIsDirty(false);
        setSlugAvailable(null);
        setErrors({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

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

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllowedModesChange = (mode: string) => {
    setFormData((prev) => {
      const updated = prev?.allowedModes.includes(mode)
        ? prev.allowedModes.filter((m) => m !== mode)
        : [...prev.allowedModes, mode];
      return { ...prev, allowedModes: updated };
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Category, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (formData.slug.length < 2) {
      newErrors.slug = "Slug must be at least 2 characters";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers and hyphens";
    } else if (slugAvailable === false) {
      newErrors.slug = "This slug is already in use";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log(formData); // homepageRules is []

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/admin/categories`, formData);
      toast.success(
        `Category created successfully,  ${formData.name} is now available.`,
      );
      onOpenChange(false);
      onRefetch?.();
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        `Failed to create category: ${axiosError.response?.data?.message || axiosError.message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg bg-white">
        <DialogHeader className="px-1 pt-2 bg-white border-b ">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Icons.add className="w-5 h-5" />
            Create New Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Organize your products with categories to improve navigation and
            discovery
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="px-1 pb-2 space-y-6">
          <div className="space-y-6">
            {/* Parent Field */}
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select
                value={formData.parent || "none"}
                onValueChange={(value) =>
                  handleSelectChange("parent", value === "none" ? null : value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select parent (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Top-level)</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                      {slugAvailable ? (
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
                placeholder="Brief description of what this category includes (shown to customers)"
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
                <div className="flex-1">
                  <Label htmlFor="requiresPayment" className="cursor-pointer">
                    Requires Payment
                  </Label>
                  <p
                    className="mt-1 text-xs text-muted-foreground"
                    id="requires-payment-desc"
                  >
                    Products in this category require payment
                  </p>
                </div>
                <Switch
                  variant="primary"
                  id="requiresPayment"
                  checked={formData.requiresPayment}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("requiresPayment", checked)
                  }
                  disabled={isSubmitting}
                  aria-describedby="requires-payment-desc"
                />
              </div>

              <div className="flex items-center justify-between p-4 space-x-3 transition-colors border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Category
                  </Label>
                  <p
                    className="mt-1 text-xs text-muted-foreground"
                    id="is-featured-desc"
                  >
                    Highlight this category on your store
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  variant="primary"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isFeatured", checked)
                  }
                  disabled={isSubmitting}
                  aria-describedby="is-featured-desc"
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
                              <Icons.linkIcon className="w-4 h-4 text-muted-foreground" />
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
          {/* Allowed Modes */}
          <div className="space-y-2">
            <Label>Allowed Modes</Label>
            <div className="flex gap-4">
              {(["PAL", "PAP"] as const).map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <Checkbox
                    size="sm"
                    checked={(formData.allowedModes ?? []).includes(mode)}
                    onChange={() => handleAllowedModesChange(mode)}
                    disabled={isSubmitting}
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select selling modes available for this category.
            </p>
          </div>

          {/* Mode Rules placeholder (future advanced UI) */}
          <div className="space-y-2">
            <ModeRulesForm
              modes={formData.allowedModes ?? []}
              value={formData.modeRules ?? {}}
              onChange={(rules) =>
                setFormData((prev) => ({ ...prev, modeRules: rules }))
              }
            />
          </div>
          <HomepageRuleForm
            rules={formData.homepageRules}
            disabled={isSubmitting}
            onChange={(updatedRules) => {
              console.log(
                "HomepageRuleForm onChange -> updatedRules:",
                updatedRules,
              );
              setFormData((prev) => ({
                ...prev,
                homepageRules: updatedRules,
              }));
            }}
          />

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 bg-white border-t sm:flex-row sm:justify-end">
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
              aria-label="Create category"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icons.add className="w-4 h-4 mr-2" />
                  Create Category
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
