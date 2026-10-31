/**
 * NotificationService interface
 * Abstracts UI-specific toasts or alerts from domain logic
 */
export interface NotificationService {
  success(message: string): void;
  info(message: string): void;
  error(message: string): void;
}

/**
 * Default notification implementation (uses sonner)
 * Can be replaced in tests or other UIs.
 */
import { toast } from "react-toastify";
export const defaultNotifier: NotificationService = {
  success: (msg) => toast.success(msg),
  info: (msg) => toast.info(msg),
  error: (msg) => toast.error(msg),
};
