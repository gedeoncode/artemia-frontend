
import { connection } from "next/server";
import OTPVerificationClientPage from "./OTPVerificationClientPage";

export default async function OTPVerificationPage() {
     await connection()
  
 return <OTPVerificationClientPage />
}
