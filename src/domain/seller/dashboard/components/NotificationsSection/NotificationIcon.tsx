import { FiBell } from "react-icons/fi";

export function NotificationIcon({ unreadCount }: { unreadCount: number }) {
  return (
    <div className="relative">
      <FiBell
        className="text-2xl text-gray-600 cursor-pointer"
        role="button"
        aria-label="Notifications"
      />
      {unreadCount > 0 && (
        <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white rounded-full shadow-md -top-1 -right-1 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 animate-pulse">
          {unreadCount}
        </span>
      )}
    </div>
  );
}