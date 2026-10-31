
import { connection } from "next/server";
import {PurposeSelectionClientPage} from "./PurposeClientPage";

export default async function PurposeSelectionPage() {
  await connection()
  return <PurposeSelectionClientPage />
}
