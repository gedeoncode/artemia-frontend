'use client'

import { Button } from "@/components/seller/ui/Button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/seller/ui/Sheet"
import { Icons } from "@/components/seller/ui/Icons"
import { NAV_ITEMS } from "@/lib/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/"

export function MobileNav() {
  const pathname = usePathname()
  const IconMenu = Icons.Menu
  const IconPackage = Icons.Package

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 md:hidden"
        >
          <IconMenu className="w-5 h-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <IconPackage className="w-6 h-6" />
            <span className="gradient-text bg-gradient-to-r from-red-900 via-blue-600 to-purple-600">
              SellerPro
            </span>
          </Link>
          {NAV_ITEMS.map((Item) =>{ 
             const Icon = Item.icon
            return (
                       <Link
              key={Item.href}
              href={Item.href}
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2",
                pathname === Item.href
                  ? "bg-gradient-to-r from-red-900/10 via-blue-600/10 to-purple-600/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon />
              {Item.title}
            </Link>
          )})}
        </nav>
      </SheetContent>
    </Sheet>
  )
}