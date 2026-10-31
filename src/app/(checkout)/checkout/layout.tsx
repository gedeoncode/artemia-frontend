import { CheckoutFooter } from "@/domain/checkout/components/Footer";
import { CheckoutNavbar } from "@/domain/checkout/components/Navbar";
import type { ReactNode } from "react";


type CheckoutLayoutProps = {
  children: ReactNode;
};

export default function CheckoutLayout({
  children,
}: CheckoutLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <CheckoutNavbar />

      <main className="flex-1">
        <div className="layout-container py-6 lg:py-10">
          {children}
        </div>
      </main>

      <CheckoutFooter />
    </div>
  );
}