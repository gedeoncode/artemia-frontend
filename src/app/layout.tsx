import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ReactQueryProvider } from "@/providers/react-query-provider";

import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import { ComingSoonProvider } from "@/context/ComingSoonProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Artemia Marketplace | Local Development",
  description:
    "Artemia est en cours de développement local. Découvrez notre plateforme en construction pour connecter acheteurs et vendeurs.",
  keywords: [
    "Artemia marketplace",
    "développement local",
    "plateforme ecommerce",
    "projet en cours",
    "artemia local",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased `}>
        <ReactQueryProvider>
          <AuthProvider>
            <ComingSoonProvider>
              <main className="min-h-screen">{children}</main>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                pauseOnHover
                draggable
                theme="light"
              />
            </ComingSoonProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
