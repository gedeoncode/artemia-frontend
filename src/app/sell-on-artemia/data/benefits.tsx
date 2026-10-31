import {
  Users,
  Shield,
  BarChart3,
  Headphones,
  Package,
  TrendingUp,
} from "lucide-react";

export const benefits = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Reach Active Buyers",
    description:
      "Connect with buyers actively searching for products in your category and ready to transact locally.",
    link: "/docs/marketplace-reach",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Clear & Secure Payment Rules",
    description:
      "Buyer-to-seller payments are handled in cash, ensuring direct transactions. Online payments (Stripe, PayPal) are used exclusively for PAP publication fees.",
    link: "/docs/payments",
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Listing & Inventory Management",
    description:
      "Create and manage your listings, organize your products, and control availability from a single dashboard.",
    link: "/docs/seller-dashboard",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Sales Insights",
    description:
      "Track listing performance and buyer engagement to better understand demand and optimize your offerings.",
    link: "/docs/analytics",
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "Seller Support",
    description:
      "Get assistance from our seller support team for onboarding, listings, and operational questions.",
    link: "/docs/support",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Promotion & Visibility Tools",
    description:
      "Use promotional features to boost your listings and increase visibility across the marketplace.",
    link: "/docs/growth",
  },
];
