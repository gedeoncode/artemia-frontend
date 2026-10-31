import { QueryClient } from "@tanstack/react-query";
import { authChannel } from "./events";
import { authUserKey } from "../constants/";

export const invalidateUser = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: authUserKey });
  authChannel.postMessage({ type: "INVALIDATE_USER" });
};
