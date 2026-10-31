

/* -------------------------------------------------------------------------- */
/*                                Event Types                                 */
/* -------------------------------------------------------------------------- */

export type AuthEvent =
  | { type: "LOGOUT" }
  | { type: "INVALIDATE_USER" };

/* -------------------------------------------------------------------------- */
/*                           Broadcast Channel (safe)                         */
/* -------------------------------------------------------------------------- */

const createSafeChannel = (): BroadcastChannel => {
  if (typeof window === "undefined") {
    return {
      postMessage: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      close: () => {},
      dispatchEvent: () => false,
      onmessage: null,
      onmessageerror: null,
    } as unknown as BroadcastChannel;
  }

  return new BroadcastChannel("auth-events");
};

export const authChannel = createSafeChannel();

/* -------------------------------------------------------------------------- */
/*                          Broadcast Helper Functions                        */
/* -------------------------------------------------------------------------- */

export const broadcastLogout = () => {
  authChannel.postMessage({ type: "LOGOUT" } satisfies AuthEvent);
};

export const broadcastUserInvalidation = () => {
  authChannel.postMessage({
    type: "INVALIDATE_USER",
  } satisfies AuthEvent);
};

/* -------------------------------------------------------------------------- */
/*                     React Query Invalidation Helper                        */
/* -------------------------------------------------------------------------- */
