"use client";

import { useFormContext } from "react-hook-form";
import { ShoppingCart, DollarSign, Star } from "lucide-react";
import { Label, Switch, RadioGroup, RadioGroupItem } from "@/components/ui/";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Section } from "../components/Section";
import { CATEGORY_NATURE_OPTIONS, CATEGORY_STATUS_OPTIONS } from "@/constants/categories";

export function CommerceSettingsSection() {
  const {
    watch,
    setValue,
  } = useFormContext();

  const type = watch("type");
  const status = watch("status");

  return (
    <Section
      title="Commerce Settings"
      description="Configure how this category behaves in your store"
      icon={<ShoppingCart className="w-4 h-4" />}
      collapsible={true}
      defaultExpanded={true}
    >
      {/* Product Type */}

      <div className="space-y-3">
        <Label>Product Nature</Label>

        <RadioGroup
          value={type}
          onValueChange={(value) => setValue("type", value)}
          className="flex gap-4"
        >
          {CATEGORY_NATURE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />

              <Label htmlFor={option.value} className="cursor-pointer">
                {option.label}

                {option.description && (
                  <span className="ml-2 text-xs text-slate-500">
                    ({option.description})
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <Label>Status</Label>

        <Select
          value={status}
          onValueChange={(value) => setValue("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            {CATEGORY_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={option.dotClassName} />

                  <span>{option.label}</span>

                  {option.description && (
                    <span className="text-xs text-gray-500">
                      - {option.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toggle Switches */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="space-y-0.5">
            <Label
              htmlFor="requiresPayment"
              className="cursor-pointer flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Requires Payment
            </Label>
            <p className="text-xs text-gray-500">
              Products in this category require payment
            </p>
          </div>
          <Switch
            id="requiresPayment"
            checked={watch("requiresPayment")}
            onCheckedChange={(checked) => setValue("requiresPayment", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="space-y-0.5">
            <Label
              htmlFor="isFeatured"
              className="cursor-pointer flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Featured Category
            </Label>
            <p className="text-xs text-gray-500">
              Highlight this category on your store
            </p>
          </div>
          <Switch
            id="isFeatured"
            checked={watch("isFeatured")}
            onCheckedChange={(checked) => setValue("isFeatured", checked)}
          />
        </div>
      </div>
    </Section>
  );
}
