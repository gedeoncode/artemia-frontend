// Single storage key with typed system
type PendingAuthAction = {
  type: "order" | "wishlist" | "checkout" | "review"; 
  path: string;
  timestamp: number; // For expiration
  metadata?: { productId: string };
};

const STORAGE_KEY = "pendingAuthAction";

export const storePreAuthAction = (
  action: Omit<PendingAuthAction, "timestamp">
) => {
  const data: PendingAuthAction = {
    ...action,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getStoredAction = (): PendingAuthAction | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const data = JSON.parse(raw) as PendingAuthAction;

  // Auto-clean expired items (1 hour)
  if (Date.now() - data.timestamp > 3_600_000) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return data;
};

export const clearStoredAction = () => {
  localStorage.removeItem(STORAGE_KEY);
};
