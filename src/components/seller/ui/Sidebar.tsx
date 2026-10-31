'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/"
import { Icons } from "@/components/seller/ui/Icons"
import { NAV_ITEMS } from "@/lib/constants"
// import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/seller/ui/Avatar"

export function Sidebar() {
  const pathname = usePathname()
  const IconPackage = Icons.Package
 

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex flex-col h-full max-h-screen gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <IconPackage className="w-6 h-6" />
            <span className="gradient-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-600">
              SellerPro
            </span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === item.href
                      ? "bg-gradient-to-r from-red-900/10 via-blue-600/10 to-purple-600/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {/* <Icon  /> */}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-red-900/10 via-blue-600/10 to-purple-600/10">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Seller Account</p>
              <p className="text-xs text-muted-foreground">admin@sellerpro.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}