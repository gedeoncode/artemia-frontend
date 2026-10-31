import { connection } from "next/server";
import { LoginCLientPage } from "./LoginCLientPage";

export default async function Login(){
   await connection()
  return <LoginCLientPage />
}