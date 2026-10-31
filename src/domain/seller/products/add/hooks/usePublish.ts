// hooks/usePublish.ts

import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import type {
  CreateProductFormSchema,
  CreateProductResponseFormSchema,
} from "../../schemas";
import { ROUTES } from "@/domain/seller/constants/routes";

interface UsePublishOpts {
  handleProductSubmit: (
    data: CreateProductFormSchema,
  ) => Promise<CreateProductResponseFormSchema>;

  methods: {
    trigger: () => Promise<boolean>;
    getValues: () => CreateProductFormSchema;
  };

  router: ReturnType<typeof useRouter>;

  cleanupAll?: () => void;
}
export const SUCCESS_DISPLAY_DURATION = 3000;

export function usePublish({
  handleProductSubmit,
  methods,
  router,
  cleanupAll,
}: UsePublishOpts) {
  const inFlight = useRef(false);

  const [publishedSuccess, setPublishedSuccess] = useState<{
    title?: string;
  } | null>(null);

  const [redirecting, setRedirecting] = useState(false);

  const publish = useCallback(async (): Promise<boolean> => {
    if (inFlight.current) {
      return false;
    }

    inFlight.current = true;

    try {
      // const isValid = await methods.trigger();

      // if (!isValid) {
      //   toast.error(
      //     "Please fix validation errors before publishing.",
      //   );

      //   return false;
      // }

      const values = methods.getValues();

      const result = await handleProductSubmit(values);

      if (!result.success) {
        toast.error(result.message ?? "Failed to publish product.");

        return false;
      }

      setPublishedSuccess({
        title: values.name ?? "Product",
      });

      toast.success(`Produit « ${values.name} » publié avec succès.`, {
        autoClose: 5000,
      });
      setRedirecting(true);

      window.setTimeout(() => {
        cleanupAll?.();
        router.push(result.redirectPath ?? ROUTES.PRODUCTS.LIST);
      }, SUCCESS_DISPLAY_DURATION);

      return true;
    } catch (error) {
      console.error("Publish error:", error);

      toast.error("Unexpected error while publishing.");

      return false;
    } finally {
      inFlight.current = false;
    }
  }, [methods, handleProductSubmit, router, cleanupAll]);

  return {
    publish,
    publishedSuccess,
    redirecting,
  };
}
