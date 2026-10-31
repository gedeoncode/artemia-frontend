import { BellIcon } from "lucide-react";

// Notification Button component
export function NotificationButton({ count }: { count: number }) {
  return (
    <button className="relative p-1.5 rounded-full hover:bg-gray-100">
      <BellIcon className="w-5 h-5 text-gray-600" />
      {count > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
