"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHeadset, FaMoneyBillWave } from "react-icons/fa";

export function CheckoutNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="layout-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16">
            <Image
              src="/logo-artemia.png"
              alt="Artemia"
              fill
              priority
              className="object-contain"
            />
          </div>

          <span className="-ml-1 hidden text-2xl font-bold gradient-text sm:block">
            artemia
          </span>
        </Link>

        {/* Checkout Status */}
        <div className="hidden items-center gap-2 rounded-full bg-gray-100 px-4 py-2 md:flex">
          <FaMoneyBillWave className="text-primary" />

          <span className="text-sm font-medium text-gray-700">
            Cash on Delivery Available
          </span>
        </div>

        {/* Help */}
        <Link
          href="/support"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
        >
          <FaHeadset />

          <span className="hidden sm:inline">
            Need Help?
          </span>
        </Link>
      </div>
    </header>
  );
}