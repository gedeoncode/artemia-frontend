  import {
  Users,
  Shield,
  Package,
  CheckCircle,

  DollarSign,

} from "lucide-react";
  export const steps = [
    {
      number: 1,
      icon: <Users className="w-6 h-6" />,
      title: "Create Your Account",
      description: "Sign up as a seller and access the Artemia Seller Center.",
      link: "/docs/account/creation",
    },
    {
      number: 2,
      icon: <Shield className="w-6 h-6" />,
      title: "Verify Your Business",
      description:
        "Submit your business documents to complete our required verification process.",
      link: "/docs/onboarding",
    },
    {
      number: 3,
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Get Approved",
      description:
        "We'll review your application and activate your shop within 24–48 hours.",
      link: "/docs/account/verification",
    },
    {
      number: 4,
      icon: <Package className="w-6 h-6" />,
      title: "Add Your Products",
      description:
        "Create product listings. Your category determines whether you use PAP or PAL mode.",
      link: "/docs/seller/product-creation",
    },
    {
      number: 5,
      icon: <DollarSign className="w-6 h-6" />,
      title: "Start Selling",
      description:
        "Receive orders and fulfill them based on your product's selling mode.",
      link: "/docs/payout",
    },
  ];