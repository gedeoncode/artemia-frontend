'use client'

import { Input } from "@/components/seller/ui/Input"
import { Icons } from "@/components/seller/ui/Icons"
import { MobileNav } from "@/components/seller/ui/MobileNav"
import { DarkModeToggle } from "@/components/seller/ui/DarkModeToggle"
// import { AvatarMenu } from "@/components/seller/ui/AvatarMenu"


export function Header() {
  // const { data: session } = useSession()
  // const IconSearch = Icons.Search

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <MobileNav />
      <div className="flex-1 w-full">
        <form>
          <div className="relative">
            {/* <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
            <Input
              type="search"
              placeholder="Search products, orders, customers..."
              className="w-full pl-8 shadow-none appearance-none bg-background md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        {/* <AvatarMenu 
          user={{
            name: session?.user?.name || 'User',
            email: session?.user?.email || '',
            image: session?.user?.image || '',
          }}
        /> */}
      </div>
    </header>
  )
}