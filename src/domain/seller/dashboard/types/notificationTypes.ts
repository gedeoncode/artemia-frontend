import { AlertCircle, Bell, CheckCircle2 } from "lucide-react";

export type RecipientUserType = "User" | "Seller" | "Admin";

export type NotificationType =
  | "NEW_SELLER_SIGNUP"
  | "NEW_ORDER"
  | "ORDER_UPDATE"
  | "ADMIN_ALERT"
  | "SELLER_ALERT";
export type RelatedEntityType = "Order" | "Product" | "User";

export interface Recipient {
  userType: RecipientUserType;
  userId: string; 
  read: boolean;
}

export interface Notification {
  _id: string;
  recipients: Recipient[];
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  relatedEntity?: string | null;
  relatedEntityType?: RelatedEntityType | null;
  createdAt: string; 
  updatedAt: string; 
}

export interface NotificationsResponse {
  data: Notification[];
  page: number;
  totalPages: number;
  totalCount: number;
  unreadCount: number;
}

export const NOTIFICATION_TYPES: Record<
  NotificationType,
  {
    bgClass: string;
    badgeClass: string;
    textClass: string;
    icon: typeof Bell;
  }
> = {
  NEW_SELLER_SIGNUP: {
    bgClass: "bg-blue-50",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    textClass: "text-blue-600",
    icon: Bell,
  },
  NEW_ORDER: {
    bgClass: "bg-yellow-50",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    textClass: "text-yellow-600",
    icon: AlertCircle,
  },
  ORDER_UPDATE: {
    bgClass: "bg-red-50",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    textClass: "text-red-600",
    icon: AlertCircle,
  },
  ADMIN_ALERT: {
    bgClass: "bg-green-50",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    textClass: "text-green-600",
    icon: CheckCircle2,
  },
  SELLER_ALERT: {
    bgClass: "bg-green-50",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    textClass: "text-green-600",
    icon: CheckCircle2,
  },
};

export interface UseNotificationListParams {
  notifications: Notification[];
  filteredNotifications: Notification[];
  loading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  markOne: (id: string) => void;
  markAll: () => void;
  markOneLoading?: boolean;
  markAllLoading?: boolean;
  refetch?: () => void;
  activeActionId: string | null;
  filter: "all" | "unread";
  setFilter: (v: "all" | "unread") => void;
  userId: string;
  pagination: {
    totalPages: number;
    totalCount: number;
    unreadCount: number;
  };
  error?: string | null;
}