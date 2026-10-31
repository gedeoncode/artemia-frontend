'use client'

import { Icons } from "@/components/seller/ui/Icons"
import { useTheme } from 'next-themes'
import { Button } from '@/components/seller/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/seller/ui/DropDown'

export function DarkModeToggle() {
  const { setTheme } = useTheme()
  const IconSun = Icons.Sun
  const IconMoon = Icons.Moon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-8 h-8 px-0">
          <IconSun className="transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <IconSun className="w-4 h-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <IconMoon className="w-4 h-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <span className="w-4 h-4 mr-2 rounded-full bg-gradient-to-r from-red-900 via-blue-600 to-purple-600" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}