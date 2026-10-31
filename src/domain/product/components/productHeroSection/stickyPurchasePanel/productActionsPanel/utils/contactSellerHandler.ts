import { AdaptedSeller } from "@/domain/product/types/adapted-product.types";
import { contactViaWhatsApp } from "./contactViaWhatsApp";
import { createLeadAnalyticsApi } from "@/domain/product/services/client/clientCreateLeadAnalytic.service";

type ContactMethod = "whatsapp" | "internal" | "email";

interface Props {
  seller?: AdaptedSeller;
  productId: string;
  productName: string;
}

export async function contactSellerHandler({
  seller,
  productId,
  productName,
}: Props) {
  const method: ContactMethod = "whatsapp";

  createLeadAnalyticsApi({
      productId,
      contactMethod: method,
      source: "product_page",
    }).catch((error)=>console.error("Failed to create lead analytics", error));
  

  switch (method) {
    case "whatsapp":
      return contactViaWhatsApp({ seller, productName });

    default:
      throw new Error("Unsupported contact method");
  }
}
