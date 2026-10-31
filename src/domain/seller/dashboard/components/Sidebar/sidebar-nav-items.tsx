import {
  FiSettings,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiUser,
  FiUpload,
  FiHome,
  FiHelpCircle,
  FiTarget,
} from "react-icons/fi";

import { translate } from "./sidebar-translations";
import { ROUTES } from "@/domain/seller/constants/routes";

export type NavItem = {
  label: string;
  path: string;
  icon: JSX.Element;
  roles?: string[];
  isPrimary?: boolean;
  badge?: number;
  totalOrders?: number;
  totalProducts?: number;
  coming_soon?: boolean;
};

export const getNavItems = (locale: string): NavItem[] => [
  {
    label: translate(locale, "dashboard"),
    path: ROUTES.DASHBOARD,
    icon: <FiSettings />,
  },
  {
    label: translate(locale, "products"),
    path: ROUTES.PRODUCTS.LIST,
    icon: <FiPackage />,
  },

  {
    label: translate(locale, "leads"),
    path: ROUTES.LEADS.LIST,
    icon: <FiTarget />,
  },
  {
    label: translate(locale, "orders"),
    path: ROUTES.ORDERS.LIST,
    icon: <FiShoppingCart />,
    coming_soon: true,
  },
  {
    label: translate(locale, "invoices"),
    path: ROUTES.INVOICES.LIST,
    icon: <FiDollarSign />,
    coming_soon: true,
  },
  {
    label: translate(locale, "profile"),
    path: ROUTES.PROFILE,
    icon: <FiUser />,
    coming_soon: true,
  },
  {
    label: translate(locale, "addProduct"),
    path: ROUTES.PRODUCTS.ADD,
    icon: <FiUpload />,
    isPrimary: true,
    roles: ["Seller", "Admin"],
  },
  { label: translate(locale, "home"), path: "/", icon: <FiHome /> },
  {
    label: translate(locale, "support"),
    path: ROUTES.SUPPORT,
    icon: <FiHelpCircle />,
    coming_soon: true,
  },
];
