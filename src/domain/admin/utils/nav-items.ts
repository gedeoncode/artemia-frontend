
import { Icons } from "@/components/Icons";

export const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: Icons.barChart,
    roles: ["admin"],
    exact: true,
  },
  {
    href: "/admin/manage-admins",
    label: "Admins management",
    icon: Icons.users,
    roles: ["admin"],
  },
  {
    href: "/admin/manage-sellers",
    label: "Sellers management",
    icon: Icons.users,
    roles: ["admin"],
  },
  {
    href: "/admin/manage-users",
    label: "Users management",
    icon: Icons.users,
    roles: ["admin"],
  },
  {
    href: "/admin/manage-products",
    label: "Products management",
    icon: Icons.shoppingBag,
    roles: ["admin", "seller"],
  },
  {
    href: "/admin/categories",
    label: "Categories management",
    icon: Icons.folderOpen,
    roles: ["admin", "category-manager"],
  },
  {
    href: "/admin/manage-orders",
    label: "Orders management",
    icon: Icons.refresh,
    roles: ["admin", "seller"],
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Icons.settings,
    roles: ["admin", "seller", "user"],
  },
];
