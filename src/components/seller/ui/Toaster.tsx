'use client'

import * as React from "react"
import { Toast, ToastTitle, ToastDescription, ToastAction, ToastClose } from "@/components/seller/ui/Use-Toast"
import { useToast } from "@/components/seller/ui/Toast"
import { X } from "lucide-react"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <div className="fixed top-0 right-0 z-[100] flex flex-col space-y-2 p-4">
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>{description}</ToastDescription>
                            )}
                            {action && (
                                <ToastAction>{action}</ToastAction>
                            )}
                            <ToastClose>
                                <X className="w-4 h-4" />
                            </ToastClose>
                        </div>
                    </Toast>
                )
            })}
        </div>
    )
}