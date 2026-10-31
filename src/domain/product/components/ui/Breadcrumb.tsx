import Link from "next/link";
import { UIProduct } from "@/types/product";
import { HOME_URL, CURRENT_URL } from "@/constants/index";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  product: UIProduct;
}

export function Breadcrumb({ product }: BreadcrumbProps) {
  const categoryName = product?.category?.name ?? "Uncategorized";
  const categorySlug = product?.category?.slug ?? "Uncategorized";

  const items: BreadcrumbItem[] = [
    { name: "Home", href: HOME_URL },
    { name: categoryName, href: `/listing/category/${categorySlug}` },
    { name: product.name, href: CURRENT_URL },
  ];

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-2 h-2 mx-1 text-slate-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}

            <Link
              href={item.href}
              className="inline-flex items-center text-xs font-medium text-slate-700 hover:text-blue-600"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
