import Link from "next/link";

import { useCart } from "@/hooks/useCart";
import CartIcon from "@/components/ui/CartIcon";

export function CartLink() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart (${cartCount} items)`}
      className="relative inline-flex items-center gap-2 rounded-md text-gray-700 transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <CartIcon
        size={32}
        className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
      />
      {cartCount > 0 && (
        <span
          className="absolute -top-2 -right-1 sm:-right-2 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold leading-none"
          style={{
            width: "18px",
            height: "18px",
            minWidth: "18px",
            fontSize: "10px",
          }}
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
}

// import React from 'react';
// import CartIcon from './CartIcon';

// interface CartLinkProps {
//   itemCount: number;
// }

// const CartLink: React.FC<CartLinkProps> = ({ itemCount = 0 }) => {
//   const badgeContent = itemCount > 99 ? '99+' : itemCount;

//   return (
//     <a
//       href="/cart"
//       className="relative inline-flex items-center justify-center p-1.5 hover:opacity-80 transition-opacity"
//       aria-label={`Shopping cart with ${itemCount} items`}
//     >
//       <CartIcon size={32} className="text-gray-800" />
//       {itemCount > 0 && (
//         <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold leading-none text-white bg-red-600 rounded-full shadow-sm ring-2 ring-white">
//           {badgeContent}
//         </span>
//       )}
//     </a>
//   );
// };

// export default CartLink;
