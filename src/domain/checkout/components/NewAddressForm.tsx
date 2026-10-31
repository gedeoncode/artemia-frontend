"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

import { NewAddress } from "../types/types";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onSubmit: (address: NewAddress) => void;
}

const INITIAL_FORM: NewAddress = {
  fullName: "",
  phone: "",
  province: "",
  city: "",
  commune: "",
  neighborhood: "",
  street: "",
  houseNumber: "",
  landmark: "",
  deliveryInstructions: "",
  deliveryMethod: "express",
  isDefault: false,
};

export const NewAddressForm: React.FC<Props> = ({ onSubmit }) => {
  const { user } = useAuth();

  const [form, setForm] = useState<NewAddress>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const requiredFields: (keyof NewAddress)[] = [
    "fullName",
    "phone",
    "neighborhood",
  ];
  /**
   * Populate authenticated user's information.
   * Only fills fields that are still empty, so we never
   * overwrite what the customer has already typed.
   */
  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName.trim() || user.name || "",
      phone: prev.phone.trim() || user.phone || "",
    }));
  }, [user]);

  const updateField = <K extends keyof NewAddress>(
    field: K,
    value: NewAddress[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError(null);
    }
  };
  const hasEmptyRequiredField = requiredFields.some((field) => {
    const value = form[field];
    return typeof value === "string" && value.trim() === "";
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasEmptyRequiredField) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    onSubmit({
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      street: form.street.trim(),
      commune: form.commune?.trim() || "",
      neighborhood: form.neighborhood?.trim() || "",
      houseNumber: form.houseNumber?.trim() || "",
      landmark: form.landmark?.trim() || "",
      deliveryInstructions: form.deliveryInstructions?.trim() || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Nouvelle adresse</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Nom complet <span className="text-red-500">*</span>
          </label>

          <Input
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Nom et prénom"
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Téléphone <span className="text-red-500">*</span>
          </label>

          <Input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+243..."
            className="h-10 text-sm"
          />
        </div>
        {/* 
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Province <span className="text-red-500">*</span>
          </label>

          <Input
            value={form.province}
            onChange={(e) => updateField("province", e.target.value)}
            placeholder="Nord-Kivu"
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Ville <span className="text-red-500">*</span>
          </label>

          <Input
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Goma"
            className="h-10 text-sm"
          />
        </div> */}

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Commune </label>

          <Input
            value={form.commune}
            onChange={(e) => updateField("commune", e.target.value)}
            placeholder="Goma"
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Quartier <span className="text-red-500">*</span>
          </label>

          <Input
            value={form.neighborhood}
            onChange={(e) => updateField("neighborhood", e.target.value)}
            placeholder="Himbi"
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">Avenue</label>

          <Input
            value={form.street}
            onChange={(e) => updateField("street", e.target.value)}
            placeholder="Avenue du Commerce"
            className="h-10 text-sm"
          />
        </div>

        {/* <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            N° Maison
          </label>

          <Input
            value={form.houseNumber}
            onChange={(e) => updateField("houseNumber", e.target.value)}
            placeholder="12A"
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Point de repère
          </label>

          <Input
            value={form.landmark}
            onChange={(e) => updateField("landmark", e.target.value)}
            placeholder="Près de..."
            className="h-10 text-sm"
          />
        </div> */}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">
          Instructions de livraison
        </label>

        <Textarea
          value={form.deliveryInstructions}
          onChange={(e) => updateField("deliveryInstructions", e.target.value)}
          rows={2}
          className="resize-none text-sm"
          placeholder="Ex : appeler avant d'arriver, 2ème étage..."
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <Button disabled={hasEmptyRequiredField} type="submit" className="w-full">
        Utiliser cette adresse
      </Button>
    </form>
  );
};
