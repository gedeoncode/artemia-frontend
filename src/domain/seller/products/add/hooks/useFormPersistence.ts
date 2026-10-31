import { useEffect, useRef, useState } from "react";

import { debounce } from "@/lib/utils";

import {
  type CreateProductFormSchema,
} from "../../schemas/CreateProductBase.schema";


import { useAutoCleanup } from "./useAutoCLeanup";
import { productDraftPersistence } from "../utils";

type Methods = {
  watch: (
    callback: (
      data: CreateProductFormSchema
    ) => void
  ) => {
    unsubscribe: () => void;
  };

  reset: (
    data: CreateProductFormSchema
  ) => void;
};

export const useFormPersistence = (
  methods: Methods
) => {
  const { watch, reset } = methods;

  const [hydrated, setHydrated] =
    useState(false);
    

  /**
   * Prevent persistence while restoring
   * persisted values.
   */
  const readyToPersist =
    useRef(false);

    useAutoCleanup({
      enabled: true,

      clear:
        productDraftPersistence.clear,

      isExpired:
        productDraftPersistence.isExpired,

      refreshExpiration:
        productDraftPersistence.refreshExpiration,
    });

  /**
   * Restore persisted draft.
   */
  useEffect(() => {
    const draft =
      productDraftPersistence.load();

    if (draft) {
      reset(draft);
    }

    /**
     * Wait for reset/watch side effects
     * to settle before enabling persistence.
     */
    queueMicrotask(() => {
      readyToPersist.current = true;

      setHydrated(true);
    });

  }, [reset]);

  /**
   * Persist form changes.
   */
  useEffect(() => {

    const persist = debounce(

      (
        data: CreateProductFormSchema
      ) => {


        if (
          !readyToPersist.current
        ) {
          return;
        }
        
        productDraftPersistence.save(
          data
        );

      },

      200

    );

    const subscription =
      watch(persist);

    return () => {

      subscription.unsubscribe();

      persist.cancel?.();

    };

  }, [watch]);

  return {
    hydrated,
  };
};