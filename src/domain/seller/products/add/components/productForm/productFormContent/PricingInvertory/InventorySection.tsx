"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { AlertCircle, Package } from "lucide-react";
import { cn } from "@/lib/utils/";

import { CreateProductFormSchema } from "@/domain/seller/products/schemas";

interface InventorySectionProps {
  isEdit: boolean;
  isSubmitting: boolean;
  lang?: "fr" | "en";
}

/**
 * Enterprise-ready Inventory Management Section
 * --------------------------------------------
 * ✅ Real-time validation
 * ✅ Accessible feedback
 * ✅ Locale-aware messages
 * ✅ Optimized for professional sellers
 */
export const InventorySection = ({
  isEdit,
  isSubmitting,
  // trackQuantity,
  lang: langProp = "fr",
}: InventorySectionProps) => {
  const { register, setValue, control } = useFormContext<CreateProductFormSchema>();

  const [lang, setLang] = useState<"fr" | "en">(langProp);
  // const stock = watch("stock") ?? 0;
  // const continueSelling = watch("continueSellingWhenOutOfStock");


const trackQuantity = useWatch({
  control,
  name: "trackQuantity",
});

const stock = useWatch({
  control,
  name: "stock",
}) ?? 0;

const continueSelling = useWatch({
  control,
  name: "continueSellingWhenOutOfStock",
});
  // Language auto-detect
  useEffect(() => {
    if (!langProp && typeof window !== "undefined") {
      const userLang = navigator.language.toLowerCase();
      setLang(userLang.startsWith("fr") ? "fr" : "en");
    }
  }, [langProp]);

  const t = useMemo(
    () => ({
      fr: {
        title: "Suivi des stocks",
        toggleTrack: "Suivre la quantité en stock",
        toggleHint:
          "Permet d’arrêter automatiquement la vente quand le stock est épuisé.",
        labelStock: "Quantité disponible",
        placeholder: "Ex: 10 unités",
        continueSell: "Continuer à vendre en rupture de stock",
        hintGood: "💡 Laisser ce champ vide ou à 0 pour désactiver les ventes.",
        tooHighWarning: "Valeur inhabituelle — vérifiez votre stock réel.",
        errorNegative: "Le stock ne peut pas être négatif.",
        errorTooHigh: "Stock trop important (max 100 000).",
        editLocked:
          "Le suivi des stocks ne peut pas être modifié en mode édition.",
      },
      en: {
        title: "Inventory Tracking",
        toggleTrack: "Track stock quantity",
        toggleHint: "Automatically stops sales when stock reaches zero.",
        labelStock: "Available quantity",
        placeholder: "e.g. 10 units",
        continueSell: "Continue selling when out of stock",
        hintGood: "💡 Leave this at 0 to pause sales when out of stock.",
        tooHighWarning: "Unusually high number — check your inventory.",
        errorNegative: "Stock cannot be negative.",
        errorTooHigh: "Stock too large (max 100,000).",
        editLocked: "Stock tracking cannot be changed in edit mode.",
      },
    }),
    [],
  );

  const text = t[lang];

  // Validation messages
  const localError =
    stock < 0 ? text.errorNegative : stock > 100_000 ? text.errorTooHigh : null;

  const showWarning = stock > 50_000 && !localError;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "p-4 space-y-4 border rounded-xl transition-colors duration-200",
        trackQuantity
          ? "bg-blue-50 border-blue-100"
          : "bg-gray-50 border-gray-200",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor="trackQuantity"
          className="flex items-center gap-2 font-medium text-gray-900"
        >
          <Package className="w-5 h-5 text-blue-600" />
          {text.toggleTrack}
        </Label>
        <Switch
          variant="primary"
          id="trackQuantity"
          checked={trackQuantity}
          disabled={isSubmitting || isEdit}
          onCheckedChange={(val) => {
            setValue("trackQuantity", val);
            if (!val) {
              setValue("stock", 0);
              setValue("continueSellingWhenOutOfStock", false);
            }
          }}
        />
      </div>

      {/* Info when disabled */}
      {isEdit && (
        <p className="text-xs italic text-gray-500">{text.editLocked}</p>
      )}
      <p className="text-sm text-gray-600">{text.toggleHint}</p>

      {/* Stock Section */}
      {trackQuantity && (
        <motion.div
          key="stock-section"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="pt-2 space-y-3"
        >
          {/* Quantity Field */}
          <div>
            <Label htmlFor="stock" className="font-medium text-gray-900">
              {text.labelStock}
            </Label>
            <Input
              id="stock"
              type="number"
              step={1}
              min={0}
              max={100_000}
              placeholder={text.placeholder}
              disabled={isSubmitting || isEdit}
              {...register("stock", {
                valueAsNumber: true,
                min: { value: 0, message: text.errorNegative },
                max: { value: 100_000, message: text.errorTooHigh },
              })}
              aria-invalid={!!localError}
              className={cn(
                "mt-1 w-full",
                localError
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-200",
              )}
            />
            {localError && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{localError}</span>
              </div>
            )}
            {!localError && (
              <p className="text-xs text-gray-500">{text.hintGood}</p>
            )}
            {showWarning && (
              <p className="text-xs text-amber-600">{text.tooHighWarning}</p>
            )}
          </div>

          {/* Continue Selling Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Label
              htmlFor="continueSellingWhenOutOfStock"
              className="font-medium text-gray-800 cursor-pointer"
            >
              {text.continueSell}
            </Label>
            <Switch
              variant="primary"
              id="continueSellingWhenOutOfStock"
              checked={continueSelling || false}
              disabled={isSubmitting || isEdit}
              onCheckedChange={(val) =>
                setValue("continueSellingWhenOutOfStock", val)
              }
            />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};
