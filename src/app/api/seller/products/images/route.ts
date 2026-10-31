import {  NextResponse } from "next/server";
import { serverFetch } from "@/lib/http/serverFetch"; // adjust path
import { SELLER_PRODUCTS_ENDPOINTS } from "@/domain/seller/products/constants/endpoints";


export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1️ Get form data from client
    const incomingFormData = await req.formData();

    // 2 Call upstream API using serverFetch
    const data = await serverFetch(`${SELLER_PRODUCTS_ENDPOINTS.UPLOAD_PRODUCT_IMAGES}`, {
      method: "POST",
      body: incomingFormData,
    });
    // 3 Return response to client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

