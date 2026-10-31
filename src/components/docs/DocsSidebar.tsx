// components/docs/DocsSidebar.tsx
import Link from "next/link";
import { docsNav } from "@/constants/docs.nav";

export function DocsSidebar() {
  return (
    <nav className="py-10">
      {docsNav.map((section) => (
        <div key={section.title} className="mb-8">
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
            {section.title}
          </h4>

          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-2 py-1 text-sm rounded-md hover:bg-muted"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
