import Link from "next/link";

export  function Footer() {
  return (
    <footer
      className="py-6 text-center text-gray-500 text-sm bg-white shadow-inner"
      aria-label="Footer"
    >
      <div>
        © {new Date().getFullYear()} Artemia Marketplace. Tous droits réservés.
      </div>
      <div className="mt-2 flex justify-center gap-4 flex-wrap text-xs sm:text-sm">
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </div>
    </footer>
  );
}
