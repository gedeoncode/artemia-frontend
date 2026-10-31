import { redirect } from "next/navigation";
import { requirePageSession } from "@/lib/auth/requirePageSession";
import { connection } from "next/server";

export default async function UserEntryPage() {
  await connection()
  const { user } = await requirePageSession();

  if (user.role !== "user") {
    redirect("/errors/403");
  }

  redirect("/"); // or /products, /feed, etc.
}
