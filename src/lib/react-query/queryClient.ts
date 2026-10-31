"use client";

import { QueryClient } from "@tanstack/react-query";
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

let client: QueryClient | null = null;

export function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
          refetchOnWindowFocus: false,
          retry: 2,
        },
      },
    });

    // Only run in browser (store in local storage)
    // if (typeof window !== "undefined") {
    //   const persister = createSyncStoragePersister({
    //     storage: window.localStorage,
    //   });

    //   persistQueryClient({
    //     queryClient: client,
    //     persister,
    //     maxAge: 1000 * 60 * 60 * 24, // 24 hours
    //   });
    // }
  }

  return client;
}