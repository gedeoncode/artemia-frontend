// hooks/mutations/useCreateCategoryMutation.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryKeys } from "@/lib/react-query/category-keys";
import { createCategoryApi } from "../services/client/createClientCategory.service";
import { toast } from "react-toastify";
import { getUserFacingMessage } from "@/errors/userMessage";
import { logger } from "@/lib/logger";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryApi,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    toast.success("Category created");
    },

    onError: (error) => {
      logger.error("error", error);
      toast.error(getUserFacingMessage(error));
    },
  });
}
