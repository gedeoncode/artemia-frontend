import Image from "next/image";
import Link from "next/link";
import { HOME_URL } from "@/constants/url";

export function Navbar() {
  return (
    <header className="flex items-center justify-center  ">
      <Link href={HOME_URL} aria-label="Go to Home Page">
        <Image
          src="/logo-artemia.png"
          alt="Artemia Marketplace Logo"
          width={120}
          height={24}
          className="max-w-[70%] sm:max-w-[120px] h-auto"
          priority
        />
      </Link>
    </header>
  );
}
