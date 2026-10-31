import { CheckCircle2, Phone } from "lucide-react";
import { cn } from "@/lib/utils/";
import { Address } from "../types/types";

interface Props {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}

export const AddressList: React.FC<Props> = ({
  address,
  selected,
  onSelect,
}) => {
  return (
    <div
      className={cn(
        "group relative px-3 py-2.5 rounded-md cursor-pointer transition-all",
        "hover:bg-gray-50/80",
        selected ? "bg-blue-50/50 ring-1 ring-blue-500/30" : "bg-transparent",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Selection indicator - minimal check */}
        <div className="flex-shrink-0 mt-0.5">
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-all",
              selected
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300 group-hover:border-gray-400",
            )}
          >
            {selected && <CheckCircle2 className="w-3 h-3 text-white m-0.5" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header - clean typography */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">
              {address.fullName}
            </span>

            {address.isDefault && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded-full flex-shrink-0">
                Principal
              </span>
            )}

            {address.addressType && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-50 rounded-full flex-shrink-0">
                {address.addressType === "home" ? "Domicile" : "Bureau"}
              </span>
            )}
          </div>

          {/* Address details - clean layout */}
          <div className="mt-0.5 space-y-0.5">
            <p className="text-xs text-gray-600 leading-relaxed">
              {address.neighborhood}, {address.street}
            </p>

            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Phone className="w-3 h-3" />
              <span>{address.phone}</span>
            </p>
          </div>

          {/* Notes - subtle, only if present */}
          {address.deliveryInstructions && (
            <p className="mt-1 text-xs text-gray-400 leading-relaxed line-clamp-1">
              {address.deliveryInstructions}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
