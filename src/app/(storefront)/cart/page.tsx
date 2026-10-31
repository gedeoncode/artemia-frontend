import { connection } from "next/server";
import { CartClientPage } from "./CartClientPage";

export default async function CartPage() {
  await connection();
  return <CartClientPage />;
}
