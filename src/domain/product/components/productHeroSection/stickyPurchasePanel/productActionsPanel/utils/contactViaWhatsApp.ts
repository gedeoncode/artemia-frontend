import { toast } from "react-toastify";
import { AdaptedSeller } from "@/domain/product/types/adapted-product.types";
interface Props {
  seller?: AdaptedSeller;
  productName: string
}

export function contactViaWhatsApp({seller, productName}:Props) {
  const phone = seller?.phone;

  if (!phone) {
    toast.error("Seller not available");
    return;
  }

  const message = `Hi, I'm interested in "${productName}". Is it still available?`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}
