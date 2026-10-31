'use client'

import { Toaster } from "@/components/seller/ui/Toaster"
import { useToast } from "@/components/seller/ui/Toast"

export function ToastProvider() {
  const { toast } = useToast()

  return (
    <>
      <Toaster />
      {/* You can add toast triggers here if needed */}
      
    </>
  )
}