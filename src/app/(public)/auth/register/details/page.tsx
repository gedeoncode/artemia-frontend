import { connection } from "next/server";
import { DetailClientPage } from "./DetailClientPage";

export default async function DetailsPage() {
  await connection()
  return <DetailClientPage />
}
