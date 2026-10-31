import Link from "next/link";
import { MapPin } from "lucide-react";

export  function Topbar() {
  return (
    <div className="text-sm text-white layout-container topbar-bg">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        {/* Location */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4" />
            <span>Livrer à Goma, RDC</span>
          </div>
        </div>

        {/* Links */}
        <div className="items-center hidden space-x-4 md:flex ">
          <Link href="/about" className="text-white link-hover">
            À propos
          </Link>
          <Link href="/contact" className="text-white link-hover">
            Contact
          </Link>
          <Link href="/help" className="text-white link-hover">
            Aide
          </Link>
        </div>
      </div>
    </div>
  );
}
