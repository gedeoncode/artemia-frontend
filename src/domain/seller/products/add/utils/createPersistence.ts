import { z } from "zod";

type PersistedData<T> = {
  version: number;
  expiresAt: number;
  data: T;
};

type CreatePersistenceOptions<T> = {
  key: string;
  schema: z.ZodSchema<T>;
  version?: number;
  expirationTime?: number;
};

export function createPersistence<T>({
  key,
  schema,
  version = 1,
  expirationTime = 1000 * 60 * 60 * 24, // 24h
}: CreatePersistenceOptions<T>) {
  const isBrowser = () => typeof window !== "undefined";

  const clear = () => {
    if (!isBrowser()) return;

    try {
      localStorage.removeItem(key);
    } catch {
      // noop
    }
  };

  const readPayload = (): PersistedData<unknown> | null => {
    if (!isBrowser()) return null;

    try {
      const raw = localStorage.getItem(key);

      if (!raw) return null;

      return JSON.parse(raw);
    } catch {
      clear();

      return null;
    }
  };

  const writePayload = (payload: PersistedData<unknown>) => {
    if (!isBrowser()) return;

    try {
      
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // noop
    }
  };

  const load = (): T | null => {
    const payload = readPayload();
    if (!payload) {
      return null;
    }

    if (
      payload.version !== version ||
      typeof payload.expiresAt !== "number"
    ) {
      clear();

      return null;
    }

    if (Date.now() > payload.expiresAt) {
      clear();

      return null;
    }

    // const validated = schema.safeParse(payload.data);

    // if (!validated.success) {
    //   clear();

    //   return null;
    // }

    return payload.data;
  };

  const save = (data: T) => {
    writePayload({
      version,

      expiresAt:
        Date.now() + expirationTime,

      data,
    });
  };

  const refreshExpiration = () => {
    const payload = readPayload();

    if (!payload) {
      return;
    }

    writePayload({
      ...payload,

      expiresAt:
        Date.now() + expirationTime,
    });
  };

  const isExpired = () => {
    const payload = readPayload();

    if (!payload) {
      return false;
    }

    return Date.now() > payload.expiresAt;
  };

  return {
    save,

    load,

    clear,

    refreshExpiration,

    isExpired,
  };
}