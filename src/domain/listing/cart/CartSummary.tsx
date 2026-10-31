// components/cart/CartSummary.tsx

import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { redirectToLogin } from "@/lib/utils/redirectToLogin";
import { storePreAuthAction } from "@/lib/utils/navigation/storePreAuthAction";
import { formatCurrency } from "@/lib";

export const CartSummary = () => {
  const { cartItems } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (!user) {
      storePreAuthAction({
        type: "checkout",
        path: `/checkout`,
      });
      redirectToLogin(router, searchParams);
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="pt-6 space-y-2 text-right border-t">
      <p className="text-lg">
        Subtotal:{" "}
        <span className="font-semibold text-blue-600">
          {formatCurrency(total)}
        </span>
      </p>
      <Button onClick={handleCheckout}>Proceed to Checkout</Button>
    </div>
  );
};
