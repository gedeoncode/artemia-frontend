"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button/Button";
import { Switch } from "@/components/ui/Switch";
import { AlertCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/";
import { NewAddress, ProductItem } from "../types/types";
import { CHECKOUT_REVIEW_KEY } from "../services/client/checkoutStorage";

interface Props {
  cartItems: ProductItem[];
  totalPrice: number;
  addressId: string | null;
  newAddress: NewAddress | null;
}

export const CheckoutFooter: React.FC<Props> = ({
  cartItems,
  totalPrice,
  addressId,
  newAddress,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = !!searchParams.get("product");

  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [setDefault, setSetDefault] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleContinueToReview = () => {
    if (!addressId && !newAddress) {
      setError("Veuillez sélectionner ou saisir une adresse de livraison");
      return;
    }

    const addressData = newAddress || (addressId ? { _id: addressId } : null);

    if (!addressData) {
      setError("Adresse manquante");
      return;
    }

    localStorage.setItem(
      CHECKOUT_REVIEW_KEY,
      JSON.stringify({
        products: cartItems,
        address: addressData,
      }),
    );

    router.push("/checkout/review");
  };

  return (
    <div className="space-y-5">
      {/* Address Options - only show when new address is added */}
      {newAddress && (
        <>
          <div className="border-t border-gray-100" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Options d&apos;adresse
              </span>
            </div>

            <div className="space-y-2">
              {/* Save address toggle */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-sm text-gray-700">
                    Enregistrer cette adresse
                  </p>
                  <p className="text-xs text-gray-400">
                    Pour vos futures commandes
                  </p>
                </div>
                <Switch
                  checked={saveNewAddress}
                  variant="primary"
                  onCheckedChange={(state) => {
                    setSaveNewAddress(state);
                    if (!state) setSetDefault(false);
                  }}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              {/* Set as default toggle */}
              <div
                className={cn(
                  "flex items-center justify-between py-1.5 transition-opacity",
                  !saveNewAddress && "opacity-40 pointer-events-none",
                )}
              >
                <div>
                  <p className="text-sm text-gray-700">Définir par défaut</p>
                  <p className="text-xs text-gray-400">
                    Utilisée automatiquement
                  </p>
                </div>
                <Switch
                  checked={setDefault}
                  variant="primary"
                  onCheckedChange={(state) => setSetDefault(state)}
                  disabled={!saveNewAddress}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error state - subtle */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50/50 rounded border border-red-200/50">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Continue button - primary action */}
      <Button
        onClick={handleContinueToReview}
        className="w-full h-11 text-sm font-medium"
      >
        Continuer vers la vérification
      </Button>
    </div>
  );
};
