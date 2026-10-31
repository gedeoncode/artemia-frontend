"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "@/domain/listing/cart/CartItemRow";
import { CartSummary } from "@/domain/listing/cart/CartSummary";
import { groupCartItemsBySeller } from "@/lib/utils/groupBySeller";
import Separator from "@/components/ui/Separator";
import Button from "@/components/ui/button/Button";

export function CartClientPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  // Memoized calculations
  const grouped = useMemo(() => groupCartItemsBySeller(cartItems), [cartItems]);
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return (
    <div
      role="region"
      aria-label="Panier"
      className="max-w-4xl px-4 py-4 mx-auto space-y-6 sm:py-8 sm:space-y-8"
    >
      {/* Header Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2 text-white rounded-full sm:p-3 bg-gradient-to-r from-blue-600 to-blue-400">
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Votre panier
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            {totalItems} {totalItems === 1 ? "article" : "articles"} dans votre
            panier
          </p>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100" />

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative">
            <Package className="w-16 h-16 mb-4 text-gray-300" />
            <ShoppingCart className="absolute w-8 h-8 text-gray-400 -top-2 -right-2" />
          </div>
          <h2 className="text-xl font-medium text-gray-700">
            Votre panier est vide
          </h2>
          <p className="mt-2 text-gray-500">
            Découvrez nos produits et trouvez quelque chose de spécial
          </p>
          <div className="flex flex-col gap-4 mt-6 sm:flex-row">
            <Button
              onClick={() => router.push("/products")}
              className="text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-md"
            >
              Commencer vos achats
            </Button>
            <Button
              onClick={() => router.push("/wishlist")}
              variant="outline"
              className="text-blue-600 border-blue-500"
            >
              Voir les articles sauvegardés
            </Button>
          </div>
        </div>
      ) : (
        /* Seller Groups */
        <div className="space-y-6 sm:space-y-8">
          {grouped.map((group, idx) => (
            <div key={group.sellerId ?? idx} className="space-y-4 sm:space-y-6">
              {/* Seller Header */}
              {/* <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-blue-800">
                  {group.sellerName}
                </h2>
              </div> */}

              {/* Items List */}
              <div className="space-y-4">
                {group.items.map((item, idx) => (
                  <div key={`${item.product}-${idx}`}>
                    <CartItemRow item={item} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Summary */}
      {cartItems.length > 0 && <CartSummary />}
    </div>
  );
}
