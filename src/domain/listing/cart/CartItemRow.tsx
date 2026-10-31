import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/stores/cartStore";
import { Trash2, Loader2 } from "lucide-react";
import { Input } from '@/components/seller/ui/Input';
import Image from "next/image";
import { toast } from "react-toastify";
import { formatCurrency } from "@/lib";

interface Props {
  item: CartItem;
}

export const CartItemRow = ({ item }: Props) => {
  const { updateQuantity, removeItem } = useCart();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Synchroniser la quantité locale avec les changements du panier
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(100, parseInt(e.target.value || "1")) || 1);
    setLocalQuantity(value);
    
    if (value !== item.quantity) {
      setIsUpdating(true);
      try {
        await updateQuantity(item.product, value);
      } catch  {
        toast.error("Échec de la mise à jour de la quantité");
        setLocalQuantity(item.quantity); // Revenir en cas d'erreur
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemoveItem = async () => {
    setIsRemoving(true);
    try {
      await removeItem(item.product);
      toast.success("Article supprimé du panier");
    } catch {
      toast.error("Échec de la suppression de l'article");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      
      className="flex items-center justify-between p-3 transition-shadow bg-white border rounded-md shadow-sm hover:shadow-md"
    >
      <div className="flex items-center flex-1 min-w-0 gap-4">
        {/* Image du produit */}
        <div className="relative w-16 h-16 overflow-hidden border rounded shrink-0">
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.name || "Produit"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 64px, 96px"
          />
        </div>

        {/* Informations sur le produit */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{item.name || "Produit"}</p>
          <p className="text-sm text-gray-500">
            {item.price !== undefined ? <>{formatCurrency(item.price)}</> : null}
            {item.variantName && (
              <span className="ml-2 text-xs text-gray-400">
                {item.variantName}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Contrôles de quantité */}
      <div className="flex items-center gap-3 ml-4">
        <div className="relative">
          <Input
            type="number"
            value={localQuantity}
            onChange={handleQuantityChange}
            className="w-16 text-center"
            min={1}
            max={100}
            disabled={isUpdating}
            aria-label="Quantité"
          />
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={handleRemoveItem}
          disabled={isRemoving}
          className="p-1 text-red-600 transition-colors rounded-full hover:bg-red-50 hover:text-red-800"
          aria-label="Supprimer l'article"
        >
          {isRemoving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
