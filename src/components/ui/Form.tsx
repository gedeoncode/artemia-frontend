// components/ui/form.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import type { UseFormReturn } from "react-hook-form";

const FormContext = React.createContext<UseFormReturn<Record<string, unknown>> | null>(null);

const Form = ({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  ...props
}: {
  schema?: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>;
  defaultValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  return (
    <FormContext.Provider value={methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

const FormField = ({
  name,
  render,
}: {
  name: string;
  render: (props: {
    field: ReturnType<UseFormReturn<Record<string, unknown>>['register']>;
    fieldState: UseFormReturn<Record<string, unknown>>['formState']['errors'][string];
    formState: UseFormReturn<Record<string, unknown>>['formState'];
  }) => React.ReactNode;
}) => {
  const methods = useFormContext();
  const field = methods.register(name);
  const fieldState = methods.formState.errors[name];
  const formState = methods.formState;

  return render({ field, fieldState, formState });
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`space-y-2 ${className}`} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none ${className}`}
    {...props}
  />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-muted-foreground ${className}`}
    {...props}
  />
));
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm font-medium text-destructive ${className}`}
    {...props}
  >
    {children}
  </p>
));
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormContext,
};
