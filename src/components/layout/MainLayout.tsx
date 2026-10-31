
import Footer from "@/components/Footer";
import { Navbar } from "@/domain";
import { CategoryNode } from "@/domain/home/services/nodeCategories.services";

export default function MainLayout({
  children,
  rootCategories,
}: {
  children: React.ReactNode;
  rootCategories: CategoryNode[];
}) {
  return (
    <>
      <Navbar rootCategories={rootCategories} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
