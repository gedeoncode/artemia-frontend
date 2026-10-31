"use client";

import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Handshake,
  Gift,
  MapPin,
  Package,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Category } from "@/types";
import { LISTING_CAPABILITIES } from "../../../constants";
import { CreateProductFormSchema } from "../../../../schemas";

// Shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Switch } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui";
import { Separator } from "@/components/ui";
import { FormFieldFeedback } from "@/components/error/FormFieldFeedback";

// Types for pricing options
type PricingOption = "fixed" | "range" | "negotiable" | "free";

interface PricingOptionConfig {
  value: PricingOption;
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

interface Props {
  className?: string;
  stepIndex: number;
  registerStepValidity: (step: number, isValid: boolean) => void;
  selectedCategory?: Category;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: "easeOut" },
};

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export function PricingLocationSection({ className, selectedCategory }: Props) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProductFormSchema>();

  // Watch form values
  const pricingType = useWatch({
    control,
    name: "pricing.type",
  });

  const trackQuantity = useWatch({
    control,
    name: "trackQuantity",
  });

  const capabilities = useMemo(() => {
    const nature = selectedCategory?.nature ?? "product";
    return LISTING_CAPABILITIES[nature];
  }, [selectedCategory]);

  // Pricing options configuration
  const pricingOptions: PricingOptionConfig[] = useMemo(
    () =>
      [
        {
          value: "fixed",
          label: "Fixed Price",
          icon: <DollarSign className="h-5 w-5" />,
          description: "Set a single, non-negotiable price",
        },
        {
          value: "range",
          label: "Price Range",
          icon: <TrendingUp className="h-5 w-5" />,
          description: "Offer a price range for negotiation",
        },
        {
          value: "negotiable",
          label: "Negotiable",
          icon: <Handshake className="h-5 w-5" />,
          description: "Price is open for discussion",
          badge: "Flexible",
        },
        {
          value: "free",
          label: "Free",
          icon: <Gift className="h-5 w-5" />,
          description: "Give away for free",
          badge: "No cost",
        },
      ].filter((option) => capabilities.pricing.types.includes(option.value)),
    [capabilities],
  );

  // Determine which pricing fields to show
  const showFixedFields =
    pricingType === "fixed" || pricingType === "negotiable";
  const showRangeFields = pricingType === "range";
  const showFreeConfirmation = pricingType === "free";

  // Helper to check if a field has errors
  const hasError = (field: string) => {
    const path = field.split(".");
    let current: any = errors;
    for (const key of path) {
      if (!current?.[key]) return false;
      current = current[key];
    }
    return !!current?.message;
  };

  const getErrorMessage = (field: string) => {
    const path = field.split(".");
    let current: any = errors;
    for (const key of path) {
      if (!current?.[key]) return "";
      current = current[key];
    }
    return current?.message || "";
  };

  return (
    <div className={className}>
      {/* ================= PRICING SECTION ================= */}
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Pricing
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose how you want to price your listing
                </p>
              </div>
              {pricingType && (
                <Badge variant="secondary" className="capitalize">
                  {pricingType}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pricing Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Pricing Strategy</Label>
              <RadioGroup
                value={pricingType}
                onValueChange={(value) =>
                  setValue("pricing.type", value as PricingOption)
                }
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {pricingOptions.map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      value={option.value}
                      id={`pricing-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`pricing-${option.value}`}
                      className="flex cursor-pointer flex-col rounded-lg border-2 border-muted bg-popover p-4 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-primary/10 p-2 text-primary">
                            {option.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {option.label}
                              </span>
                              {option.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {option.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/20 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/20" />
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Currency & Unit Selection */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Currency
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("pricing.currencyCode", value)
                  }
                  defaultValue="USD"
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">USD</span>
                        <span className="text-muted-foreground">($)</span>
                        <Badge variant="outline" className="text-xs">
                          United States
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="CDF">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">CDF</span>
                        <span className="text-muted-foreground">(FC)</span>
                        <Badge variant="outline" className="text-xs">
                          Congo
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </Label>
                <Select
                  onValueChange={(value) => setValue("pricing.unit", value)}
                >
                  <SelectTrigger id="unit" className="w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {capabilities.pricing.units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Conditional Pricing Fields */}
            <AnimatePresence mode="wait">
              {showFreeConfirmation && (
                <motion.div
                  key="free"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <p
                    className="border-emerald-200 bg-emerald-50 text-emerald-800"
                    title=" This listing will be marked as free. No payment will be
                      required."
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    This listing will be marked as free. No payment will be
                    required.
                  </p>
                </motion.div>
              )}

              {showFixedFields && (
                <motion.div
                  key="fixed"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPrice"
                      className="text-sm font-medium"
                    >
                      {pricingType === "negotiable"
                        ? "Suggested Price"
                        : "Price"}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="currentPrice"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        className={`pl-7 ${hasError("pricing.currentPrice") ? "border-destructive" : ""}`}
                        {...register("pricing.currentPrice", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {hasError("pricing.currentPrice") && (
                      <FormFieldFeedback
                        message={getErrorMessage("pricing.currentPrice")}
                      />
                    )}
                    {pricingType === "negotiable" && (
                      <p className="text-xs text-muted-foreground">
                        This is your suggested price. Buyers can make offers.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {showRangeFields && (
                <motion.div
                  key="range"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="minPrice" className="text-sm font-medium">
                      Minimum Price
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="minPrice"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        className={`pl-7 ${hasError("pricing.minPrice") ? "border-destructive" : ""}`}
                        {...register("pricing.minPrice", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {hasError("pricing.minPrice") && (
                      <FormFieldFeedback
                        message={getErrorMessage("pricing.minPrice")}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPrice" className="text-sm font-medium">
                      Maximum Price
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="maxPrice"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        className={`pl-7 ${hasError("pricing.maxPrice") ? "border-destructive" : ""}`}
                        {...register("pricing.maxPrice", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {hasError("pricing.maxPrice") && (
                      <FormFieldFeedback
                        message={getErrorMessage("pricing.maxPrice")}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* ================= INVENTORY SECTION ================= */}
        {capabilities.inventory.enabled && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={sectionVariants}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Package className="h-5 w-5 text-blue-600" />
                      Inventory
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage your stock and availability
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {trackQuantity ? "Tracking" : "Not tracking"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Inventory Tracking Toggle */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="trackQuantity" className="font-medium">
                      Track inventory
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Monitor stock levels and prevent overselling
                    </p>
                  </div>
                  <Switch
                    id="trackQuantity"
                    checked={trackQuantity}
                    onCheckedChange={(checked) =>
                      setValue("trackQuantity", checked)
                    }
                  />
                </div>

                {/* Conditional Inventory Fields */}
                <AnimatePresence mode="wait">
                  {trackQuantity && (
                    <motion.div
                      key="inventory-fields"
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="stock" className="text-sm font-medium">
                          Available Quantity
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="stock"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder="Enter available quantity"
                          className={
                            hasError("stock") ? "border-destructive" : ""
                          }
                          {...register("stock", {
                            valueAsNumber: true,
                          })}
                        />
                        {hasError("stock") && (
                          <FormFieldFeedback
                            message={getErrorMessage("stock")}
                          />
                        )}
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor="continueSellingWhenOutOfStock"
                            className="font-medium"
                          >
                            Continue selling when out of stock
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow backorders or pre-orders
                          </p>
                        </div>
                        <Switch
                          id="continueSellingWhenOutOfStock"
                          {...register("continueSellingWhenOutOfStock")}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!trackQuantity && (
                  <FormFieldFeedback
                    message="  Inventory tracking is disabled. You won't be able to
                      monitor stock levels."
                    icon={<AlertCircle className="h-4 w-4" />}
                    type="info"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ================= LOCATION SECTION ================= */}
        {capabilities.shipping.enabled && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={sectionVariants}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Location
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Where is this item located?
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City / Town
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g., Kinshasa"
                      className={
                        hasError("shipping.location.city")
                          ? "border-destructive"
                          : ""
                      }
                      {...register("shipping.location.city")}
                    />
                    {hasError("shipping.location.city") && (
                      <FormFieldFeedback
                        message={getErrorMessage("shipping.location.city")}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quartier" className="text-sm font-medium">
                      Neighborhood / District
                    </Label>
                    <Input
                      id="quartier"
                      placeholder="e.g., Gombe"
                      className={
                        hasError("shipping.location.quartier")
                          ? "border-destructive"
                          : ""
                      }
                      {...register("shipping.location.quartier")}
                    />
                    {hasError("shipping.location.quartier") && (
                      <FormFieldFeedback
                        message={getErrorMessage("shipping.location.quartier")}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avenue" className="text-sm font-medium">
                      Street Address
                    </Label>
                    <Input
                      id="avenue"
                      placeholder="e.g., Avenue de la Libération, No. 123"
                      className={
                        hasError("shipping.location.avenue")
                          ? "border-destructive"
                          : ""
                      }
                      {...register("shipping.location.avenue")}
                    />
                    {hasError("shipping.location.avenue") && (
                      <FormFieldFeedback
                        message={getErrorMessage("shipping.location.avenue")}
                      />
                    )}
                  </div>
                </div>

                <FormFieldFeedback
                className=" text-xs "
                  message="   This location helps buyers understand where the item is
                    located and estimate shipping costs."
                    type="info" 
                  icon={<MapPin className="h-4 w-4" />}
                  variant="card"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
