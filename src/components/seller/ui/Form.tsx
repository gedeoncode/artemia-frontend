'use client'

import * as React from "react"
import { useForm as useReactHookForm, type UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ZodType, type ZodTypeDef } from "zod"
import { cn } from "@/lib/utils/"

type FormProps<
  TFormValues extends FieldValues,
  Schema
> = {
  className?: string
  onSubmit: (values: TFormValues) => Promise<void> | void
  children: React.ReactNode | ((props: { isSubmitting: boolean }) => React.ReactNode)
  options?: UseFormProps<TFormValues>
  schema?: Schema
  id?: string
}

import type { FieldValues } from "react-hook-form"

export const Form = <
  TFormValues extends FieldValues = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<unknown, ZodTypeDef, unknown>
>({
  className,
  onSubmit,
  children,
  options,
  schema,
  id,
}: FormProps<TFormValues, Schema>) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useReactHookForm<TFormValues>({
    ...options,
    resolver: schema
      ? zodResolver(schema as ZodType<TFormValues, ZodTypeDef, TFormValues>)
      : undefined,
  })

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      id={id}
    >
      {typeof children === "function"
        ? (children as (props: { isSubmitting: boolean }) => React.ReactNode)({ isSubmitting })
        : children}
    </form>
  )
}

type FormFieldContextValue = {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = ({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const { formState, getFieldState } = useReactHookForm()

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    name: fieldContext.name,
    ...fieldState,
  }
}

type FormItemProps = {
  className?: string
  children: React.ReactNode
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {children}
      </div>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { error } = useFormField()

  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none",
        error && "text-destructive",
        className
      )}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const { error } = useFormField()

  return (
    <div
      ref={ref}
      data-invalid={error ? "" : undefined}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField()
  const body = error ? String(error.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
}