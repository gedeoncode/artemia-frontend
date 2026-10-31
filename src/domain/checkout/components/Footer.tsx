"use client";

import Link from "next/link";
import { FaBoxOpen, FaHeadset, FaMoneyBillWave } from "react-icons/fa";

export function CheckoutFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="layout-container py-8">
        {/* Trust Section */}
        <div className="mb-8 grid gap-6 border-b border-gray-200 pb-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <FaMoneyBillWave className="mb-3 text-2xl text-primary" />
            <h3 className="font-semibold text-gray-900">
              Cash on Delivery
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Pay when your order is delivered in eligible locations.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <FaBoxOpen className="mb-3 text-2xl text-primary" />
            <h3 className="font-semibold text-gray-900">
              Easy Returns
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Eligible items can be returned according to our return policy.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <FaHeadset className="mb-3 text-2xl text-primary" />
            <h3 className="font-semibold text-gray-900">
              Customer Support
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Our support team is here to help before and after your purchase.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <nav className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <Link href="/privacy" className="transition-colors hover:text-gray-900">
            Privacy Policy
          </Link>

          <Link href="/terms" className="transition-colors hover:text-gray-900">
            Terms & Conditions
          </Link>

          <Link href="/returns" className="transition-colors hover:text-gray-900">
            Returns & Refunds
          </Link>

          <Link href="/shipping" className="transition-colors hover:text-gray-900">
            Shipping Policy
          </Link>

          <Link href="/support" className="transition-colors hover:text-gray-900">
            Help Center
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Artemia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}