// types/order.ts

import { CurrencyCode } from "@/types/product/product.types";
export interface ProductItem {
  product: string;
  quantity: number;
  price: number; // Optional: used only on frontend for total calc
  name?: string; // Optional: used only on frontend for display
  currency: CurrencyCode
  image: string
}
export interface BaseAddress {
    fullName: string;
  phone: string;

  province?: string;
  city?: string;

  commune?: string;
  neighborhood?: string;

  street?: string;
  houseNumber?: string;

  landmark?: string;
  deliveryInstructions?: string;

  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  deliveryMethod?: "express" | "hub";

  isDefault?: boolean;
}
export interface Address extends BaseAddress{
  _id: string;
}


export interface OrderPayload {
  products: ProductItem[];
  paymentMethod: "cash_on_delivery" | "mobile_money" | "card";
  deliveryDate: string;
  addressId?: string;
  newAddress?: BaseAddress;
  saveNewAddress?: boolean;
  setDefault?: boolean;
}

export interface Order {
  _id: string;
  seller: string;
  products: ProductItem[];
  totalPrice: number;
  deliveryDate: string;
  paymentMethod: "cash_on_delivery" | "mobile_money" | "card";
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
}

export interface OrderResponse {
  message: string;
  orders: Order[];
}


export interface OrderResponse {
  message: string;
  orders: Order[];
}

export interface AddressesResponse {
  message: string;
  data: Address[];
}

export interface AddressResponse {
  message: string;
  data: Address;
}
