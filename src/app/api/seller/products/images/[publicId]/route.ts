// DELETE /api/seller/product/images/:publicId
import { NextRequest } from "next/server";

import { withHandler } from "@/lib/http";
import { deleteProductImage } from "@/domain/seller/products/add/services";
export const DELETE = withHandler(async (_req: NextRequest, { params }:{
  params: Promise<{
    publicId: string
  }>
}) => {

  const {publicId} = await params;


  return await deleteProductImage(decodeURIComponent(publicId));
});
