
import { connection } from "next/server";
import { EmailClientPage } from "./EmailClientPage";

export default async function EmailPage() {
  await connection()
return <EmailClientPage />
}
