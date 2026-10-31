"use server";

import { createProduct } from "../services";
import { ProductFormData } from "../../types";

export async function createProductAction(data: ProductFormData) {
  return createProduct(data);
}
