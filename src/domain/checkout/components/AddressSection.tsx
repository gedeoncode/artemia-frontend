import { AddressList } from "./AddressList";
import { NewAddressForm } from "./NewAddressForm";

import { AlertCircle, ChevronDown, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button/Button";
import { Skeleton } from "@/components/ui/Skeleton";

import { Address } from "../types/types";
import { useAddresses } from "../hooks/useAddresses";
import { useAddressSelection } from "../hooks/useAddressSelection";

interface Props {
  onAddressSelect: (
    selection:
      | { type: "existing"; id: string }
      | { type: "new"; data: Address }
      | { type: "none" },
  ) => void;
}

export const AddressSection: React.FC<Props> = ({ onAddressSelect }) => {
  const { addresses, isLoading, error, refetch, addAddress } = useAddresses();

  const {
    mode,
    selectedId,
    showAllAddresses,

    firstAddress,
    remainingAddresses,

    selectAddress,
    toggleNewAddress,
    toggleShowAll,
    handleNewAddressSubmit,
  } = useAddressSelection({
    addresses,
    addAddress,
    onAddressSelect,
  });

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-20 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200/50 bg-red-50/50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />

          <span className="flex-1">{error}</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-red-700 hover:bg-red-100/50 hover:text-red-800"
          >
            Réessayer
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Adresses enregistrées
            </span>

            <span className="text-xs text-gray-400">
              {addresses.length}{" "}
              {addresses.length <= 1 ? "adresse" : "adresses"}
            </span>
          </div>

          <div className="space-y-2">
            {addresses.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
                Aucune adresse enregistrée
              </div>
            )}

            {firstAddress && (
              <AddressList
                address={firstAddress}
                selected={selectedId === firstAddress._id}
                onSelect={() => selectAddress(firstAddress._id)}
              />
            )}

            {showAllAddresses &&
              remainingAddresses.map((address) => (
                <AddressList
                  key={address._id}
                  address={address}
                  selected={selectedId === address._id}
                  onSelect={() => selectAddress(address._id)}
                />
              ))}

            {remainingAddresses.length > 0 && (
              <button
                onClick={toggleShowAll}
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    showAllAddresses ? "rotate-180" : ""
                  }`}
                />

                {showAllAddresses
                  ? "Masquer"
                  : `Voir ${remainingAddresses.length} autre${
                      remainingAddresses.length > 1 ? "s" : ""
                    }`}
              </button>
            )}
          </div>

          <div className="border-t border-gray-200/60 pt-2">
            <button
              onClick={toggleNewAddress}
              className="group flex w-full items-center gap-3 py-3 text-left"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
                <Plus className="h-4 w-4 text-gray-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Ajouter une nouvelle adresse
                </p>

                <p className="text-xs text-gray-400">
                  Saisissez un autre lieu de livraison
                </p>
              </div>

              <ChevronRight
                className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${
                  mode === "new" ? "rotate-90" : "group-hover:translate-x-0.5"
                }`}
              />
            </button>

            {mode === "new" && (
              <div className="mt-4 rounded-lg border border-gray-200/80 bg-white p-4">
                <NewAddressForm onSubmit={handleNewAddressSubmit} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
